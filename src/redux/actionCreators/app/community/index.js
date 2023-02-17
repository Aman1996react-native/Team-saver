import  {ActionTypes} from '../../../actionTypes';
import * as Endpoints from '../../../../services/endPoints'
import * as NetworkParams from '../../../../services/networkParams'
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { RewardsActionCreator } from '../rewards';
import { GenericGetCall, GenericPostCall } from '../../genericPostCall';



export const CommunityActionCreator = {

  //create community
  createCommunity: (userId,name,desc,message,image,isPublic) => async (dispatch,getState) => {

        dispatch({type:ActionTypes.CREATE_COMMUNITY_REQUEST})
        try{
       
        const apiResponse = await GenericPostCall(dispatch,Endpoints.CreateCommunity,JSON.stringify({
            user_id:userId,
            Name:name,
            Description:desc,
            Message:message,
            CoverImage:image,
            IsPublic:isPublic
          }))

            dispatch({type:ActionTypes.CREATE_COMMUNITY_REPONSE,payload:apiResponse})
        }
        catch(e){
          console.log('/////...../////ERROR: '+e.toString())
            dispatch({type:ActionTypes.CREATE_COMMUNITY_REPONSE,payload:e,error:true})
        }
  },

  //get communities by user
  getCommunitiesByUser: (userId) => async (dispatch,getState) => {

    dispatch({type:ActionTypes.GET_COMMUNITIES_BY_USER_REQUEST})
    try{
   
    const apiResponse = await GenericPostCall(dispatch,Endpoints.GetCommunities,JSON.stringify({
        user_id:userId
      }))


        dispatch({type:ActionTypes.GET_COMMUNITIES_BY_USER_REPONSE,payload:apiResponse})
    }
    catch(e){
      console.log('/////...../////ERROR: '+e.toString())
        dispatch({type:ActionTypes.GET_COMMUNITIES_BY_USER_REPONSE,payload:e,error:true})
    }
},

//get all communities
getAllCommunities: (userId) => async (dispatch,getState) => {

    dispatch({type:ActionTypes.GET_ALL_COMMUNITIES_REQUEST})
    try{
   
        const apiResponse = await GenericPostCall(dispatch,Endpoints.GetAllCommunities,JSON.stringify({
          user_id:userId
        }))

        if(typeof(apiResponse) != 'undefined'){
          if(apiResponse.length > 0){
              apiResponse.forEach(item => {
                  item.arrayItem = 'communities'
              })
          }
      }

        dispatch({type:ActionTypes.GET_ALL_COMMUNITIES_REPONSE,payload:apiResponse})
    }
    catch(e){
      console.warn('/////...../////ERROR GET ALL COMMUNITIES: '+e.toString())
        dispatch({type:ActionTypes.GET_ALL_COMMUNITIES_REPONSE,payload:e,error:true})
    }
},

//post comment
postComments: (userId,communityId,comment) => async (dispatch,getState) => {

  dispatch({type:ActionTypes.POST_COMMENTS_REQUEST})
  try{
 
  const apiResponse = await GenericPostCall(dispatch,Endpoints.PostCommunityComments,JSON.stringify({
      user_id:userId,
      CommunityID:communityId,
      Comment:comment
    }))

    
    dispatch(CommunityActionCreator.getAllCommunities(userId))
    dispatch(CommunityActionCreator.getCommunitiesByUser(userId))

      dispatch({type:ActionTypes.POST_COMMENTS_REPONSE,payload:apiResponse})
  }
  catch(e){
    console.log('/////...../////ERROR: '+e.toString())
      dispatch({type:ActionTypes.POST_COMMENTS_REPONSE,payload:e,error:true})
  }
},

//reset post comments
resetPostComments: () => async (dispatch,getState) => {
  dispatch({type:ActionTypes.POST_COMMENTS_RESET,payload:{}})
},

//join community
joinCommunity: (userId,communityId) => async (dispatch,getState) => {

  dispatch({type:ActionTypes.JOIN_COMMUNITY_REQUEST})
  try{
 
  const apiResponse = await GenericPostCall(dispatch,Endpoints.JoinCommunity,JSON.stringify({
      user_id:userId,
      JoinCommunityList:[{CommunityID:communityId}]
    }))

      dispatch({type:ActionTypes.JOIN_COMMUNITY_REPONSE,payload:apiResponse})
  }
  catch(e){
    console.log('/////...../////ERROR: '+e.toString())
      dispatch({type:ActionTypes.JOIN_COMMUNITY_REPONSE,payload:e,error:true})
  }
},

//join community reset
joinCommunityReset: () => async (dispatch,getState) => {

  dispatch({type:ActionTypes.JOIN_COMMUNITY_REQUEST})
  try{

      dispatch({type:ActionTypes.JOIN_COMMUNITY_RESET,payload:{}})
  }
  catch(e){
    console.log('/////...../////ERROR: '+e.toString())
      dispatch({type:ActionTypes.JOIN_COMMUNITY_RESET,payload:{},error:true})
  }
},

//edit community
editCommunity: (userId,commuityId,name,desc,message,image,isPublic) => async (dispatch,getState) => {

  dispatch({type:ActionTypes.EDIT_COMMUNITY_REQUEST})
  try{
 
  const apiResponse = await GenericPostCall(dispatch,Endpoints.EditCommunity,JSON.stringify({
    CommunityID:commuityId,
    user_id:userId,
    Name:name,
    Description:desc,
    Message:message,
    CoverImage:image,
    IsPublic:isPublic
    }))

    dispatch(CommunityActionCreator.getAllCommunities(userId))
    dispatch(CommunityActionCreator.getCommunitiesByUser(userId))
    
      dispatch({type:ActionTypes.EDIT_COMMUNITY_REPONSE,payload:apiResponse})
  }
  catch(e){
    console.log('/////...../////ERROR: '+e.toString())
      dispatch({type:ActionTypes.EDIT_COMMUNITY_REPONSE,payload:e,error:true})
  }
},
}