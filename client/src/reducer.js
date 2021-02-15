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
        photo_url: action.photo_url,
        isLogin: action.isLogin,
      };
    case "CHATROOM_IS_OPEN":
      return {
        ...state,
        isChatOpen: action.isChatOpen,
        peerid: action.peerid,
        peername: action.peername,
        peer_url: action.peer_url,
      };

    default:
      return state;
  }
};

export default reducer;
