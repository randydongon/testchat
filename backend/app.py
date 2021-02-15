import os.path
import tornado.ioloop
import tornado.web
import tornado.httpserver
import tornado.auth
import tornado.options
from tornado.options import define, options
from pymongo import MongoClient
from bson.json_util import dumps
import asyncio
from datetime import datetime
import json
# import logging
# import requests
from bson.objectid import ObjectId
from bson.binary import Binary
import time
import re
# from capturestreams import mystreams


define('port', default=9393, help='run on the given port', type=int)


class Application(tornado.web.Application):
    def __init__(self):
        handlers = [(r"/adduser", MainHandler),
                    (r"/profile/(.*?)", MainHandler),
                    (r"/update", MainHandler),
                    (r'/sendmessage', HandleMessage),
                    (r'/receivemessage', HandleReceive),
                    (r'/users/profile', UsersProfile),
                    (r'/searchfriend/(.*?)', HandleAddFriends),
                    (r'/requestaddfriend', HandleAddFriends),
                    (r'/friend/request', HandleFriendRequest),
                    (r'/friend/request/(.*?)', HandleFriendRequest),
                    (r'/request/list/(.*?)', HandleFriendsList)

                    ]
        conn = MongoClient('mongodb://localhost:27017')
        conn2 = MongoClient('mongodb://localhost:27018')

        self.db = conn.get_database('chatapp_db')
        self.dbs = conn2.get_database('chatapp_db')

        tornado.web.Application.__init__(self, handlers, debug=True)

# pullTop


class MainHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        print('set headers!!')
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Headers', '*')
        self.set_header('Access-Control-Max-Age', 1000)
        self.set_header('Content-type', 'application/json')
        self.set_header('Access-Control-Allow-Methods',
                        'POST, GET, PUT, DELETE, OPTIONS')
        self.set_header('Access-Control-Allow-Headers',
                        'Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Headers, X-Requested-By, Access-Control-Allow-Methods')

    def options(self):
        pass

    def post(self):

        coll = self.application.db.get_collection('user_profile')

        payload = json.loads(str(self.request.body, 'utf-8'))
        # check if the profile exists in database
        profile = coll.find_one({'email': payload['email'].strip()})

        # photo_binary = Binary(payload['photo_url'])
        if not profile:
            resp = coll.insert_one({'_id': payload['_id'], 'user_name': payload['user_name'],
                                    'email': payload['email'], 'password': payload['password'],
                                    'dob': payload['dob'], 'gender': payload['gender'], 'photo_url': payload['photo_url'], 'isLogin': payload['isLogin'], 'friends_list': payload['friends_list']})
            message = {
                'status_code': 200,
                'status_ok': 'pass',
                'message': 'User added!'}

        else:

            message = {
                'status_code': 400,
                'status_ok': 'fail',
                'message': 'Email already taken '}

        self.write(message)

    def get(self, email):
        useremail = email.strip()
        coll = self.application.db.get_collection('user_profile')
        user = coll.find_one({'email': useremail})

        if user:
            user['status'] = 200
            self.write(dumps(user))
        else:
            message = {
                'status': 400,
                'message': 'Email or password doesnt match'
            }

            self.write(dumps(message))

    def put(self):
        # result = self.prepare()

        coll = self.application.db.get_collection('user_profile')
        payload = json.loads(str(self.request.body, 'utf-8'))
        resp = coll.find_one({'user_name': payload['user_name']})
        id = str(ObjectId(resp['_id']))

        _id = id

        resp = coll.update_one({'_id': ObjectId(_id['$oid'] if '$oid' in _id else ObjectId(_id))},
                               {'$set': {'user_name': payload['user_name'], 'email': payload['email'], 'password': payload['password'], 'gender': payload['gender'], 'photo_url': payload['photo_url'], 'mobile': payload['mobile']}})

        self.write("put message")


class HandleMessage(MainHandler):

    def post(self):

        msg = json.loads(str(self.request.body, 'utf-8'))

        message = {}
        if msg:
            coll = self.application.db.get_collection('messages')

            senddate = time.asctime(time.localtime(time.time()))

            db = self.application.db
            # db.list_collection_name('messages').list_collection_name('inbox').insert(
            #     {'user_name': msg['user_name'], 'id': msg['id'], 'text': msg['text']})

            # coll.insert_one(
            #     {'username': msg['username'], 'id': msg['id'], 'text': msg['text'], 'datesend': senddate})
            id = msg['id']
            cl = db[id]
            cll = cl['inbox']
            cll.insert(
                {'fromid': id, 'toid': msg['toid'], 'toname': msg['toname'], 'text': msg['text']})
            notification_col = self.application.db.get_collection(
                'user_profile')
            notification_col.update_one({'_id': msg['toid'], 'friends_list.peerid': id}, {
                '$inc': {'friends_list.$.notification': 1}})

            # coll.update({'_id': id, 'friend_request.id': payload['peerid']}, {
            #     '$set': {'friend_request.$.status': True}})
            # coll['messages']['123']['inbox'].insert_one(
            #     {'datesend': senddate, 'username': msg['username'], 'id': msg['id'], 'text': msg['text'], 'datesend': senddate})

            messsage = {
                'status': 200,
                'message': 'Message sent'
            }
        else:
            message = {
                'status': 400,
                'message': 'Error: Unable to send message'
            }

        self.write(dumps(message))

    def get(self):
        coll = self.application.db.get_collection('messages')
        msg = coll.find()

        self.write(dumps(msg))


class UsersProfile(MainHandler):
    def get(self):
        coll = self.application.db.get_collection('user_profile')
        resp = coll.find()
        # print(resp)

        if resp:
            self.write(dumps(resp))
        else:
            message = {
                'status': 400,
                'message': 'Error while retreiving users'
            }
            self.write(message)


class HandleReceive(MainHandler):

    def get(self):

        coll = self.application.db.get_collection('messages')
        msg = coll.find().sort([('$natural', -1)]).limit(25)
        msglist = []
        for x in msg:
            msglist.append(x)
        msglist.reverse()

        self.write(dumps(msglist))


class HandleAddFriends(MainHandler):
    def options(self):
        pass

    def post(self):  # update friends list
        coll = self.application.db.get_collection('user_profile')
        payload = json.loads(str(self.request.body, 'utf-8'))

        id = payload['_id']
        resp = coll.update_one({'_id': id}, {'$push': {'friends_list': {
                               '$each': [{'peername': payload['peername'], 'peerid':payload['peerid']}]}}})

        coll.update({'_id': id, 'friend_request.id': payload['peerid']}, {
                    '$set': {'friend_request.$.status': True}})
        if resp:

            message = {
                'status_code': 200,
                'status_ok': 'pass',
                'message': 'User added!'}

        else:

            message = {
                'status_code': 400,
                'status_ok': 'fail',
                'message': 'Email already taken '}

        self.write(message)

    def get(self, name):  # search user
        coll = self.application.db.get_collection('user_profile')
        val = str(name.strip())
        resp = coll.find(
            {'user_name': {'$regex': '.*{}.*'.format(val), '$options': 'i'}})

        if resp:
            self.write(dumps(resp))
        else:
            message = {
                'status': 400,
                'message': "Cannot find in the database -> {}".format(val)
            }
            self.write(dumps(message))


class HandleFriendRequest(MainHandler):
    def options(self):
        pass

    def put(self):
        coll = self.application.db.get_collection('user_profile')
        payload = json.loads(str(self.request.body, 'utf-8'))
        print(payload, 'send friend request')

        if payload['peerid'] and payload['user_id']:
            resp = coll.update({'_id': payload['peerid']}, {'$push': {'friend_request': {
                '$each': [{'name': payload['user_name'], 'id':payload['user_id'], 'status':False}]}}})
            if resp:
                self.write(dumps({'status': 200, 'message': 'request sent'}))
            else:
                message = {
                    'status': 404,
                    'message': 'Error sending friend request. ',
                }
                self.write(dumps(message))
        else:
            message = {
                'status': 400,
                'message': payload
            }

            self.write(dumps(message))

    def get(self, id):
        coll = self.application.db.get_collection('user_profile')

        resp = coll.find({'_id': id}, {'friend_request'})
        if resp:
            self.write(dumps(resp))
        else:

            message = {
                'status': 400,
                'message': 'No request found'
            }
            self.write(dumps(message))


class HandleFriendsList(MainHandler):
    def get(self, id):
        coll = self.application.db.get_collection('user_profile')
        resp = coll.find({'_id': id}, {'friends_list': [{}]})
        if resp:
            self.write(dumps(resp))
        else:
            message = {
                'status': 400,
                'message': "You haven't added any friends on your list"
            }
            self.write(dumps(message))


if __name__ == '__main__':
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()


# binary_avatar = Binary(avat)

# user={
#     ...
#     "avatar":avatar,
#     "avatar_file": binary_avatar
#     ...
# }
