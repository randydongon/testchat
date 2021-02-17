export const initialState = {
  user_name: "",
  user_id: "",
  email: "",
  photo_url: "",
  isLogin: false,
  peerid: "",
  peername: "",
  isChatOpen: false,
  peer_url: "",
  request_status: false,
  notify: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FRIEND_REQUEST":
      return {
        ...state,
        peerid: action.peerid,
        peername: action.peername,
        request_status: action.request_status,
      };
    case "CURRENT_USER":
      return {
        ...state,
        user_name: action.user_name,
        user_id: action.user_id,
        email: action.email,
        isLogin: action.isLogin,
        peerid: action.peerid,
        peername: action.peername,
        isChatOpen: action.isChatOpen,
      };
    case "CHATROOM_OPEN":
      return {
        ...state,
        isChatOpen: action.isChatOpen,
        peerid: action.peerid,
        peername: action.peername,
        notify: action.notify,
      };

    default:
      return state;
  }
};

export default reducer;
