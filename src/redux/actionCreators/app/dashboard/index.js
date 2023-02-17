
import {ActionTypes} from '../../../actionTypes';
import * as Endpoints from '../../../../services/endPoints'
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { GenericGetCall, GenericPostCall } from '../../genericPostCall';
import { RewardsActionCreator } from '../rewards';

export const DashboardActionCreator = {

//get hero titles
getHeroTiles: (isDashboard) => async (dispatch,getState) => {
  
    isDashboard ? dispatch({type:ActionTypes.GET_HERO_TILES_REQUEST}) : dispatch({type:ActionTypes.GET_HERO_TILES_OFFERS_REQUEST})
    try{
        const apiResponse = await GenericGetCall(Endpoints.GetHeroTiles,dispatch)

        
        let dashboardHeroTiles = []
        let offersHeroTiles = []

        // console.warn('Hero TILES: '+JSON.stringify(apiResponse))

        if(typeof(apiResponse) != 'undefined'){
            if(typeof(apiResponse.ForDashboardTop) != 'undefined'){
                if(apiResponse.ForDashboardTop != null){
                    if(apiResponse.ForDashboardTop.length > 0){
                        apiResponse.ForDashboardTop.forEach(item => {
                            item.arrayItem = 'heroTile'
                            if(typeof(item.Image) != 'undefined'){
                                if(item.Image.length > 10){
                                    item.Image = item.Image + `?${new Date()}`
                                }
                            }
                        })
                    }
                }
            }

            if(typeof(apiResponse.ForDashboardBottom) != 'undefined'){
                if(apiResponse.ForDashboardBottom != null){
                    if(apiResponse.ForDashboardBottom.length > 0){
                        apiResponse.ForDashboardBottom.forEach(item => {
                            item.arrayItem = 'heroTileBottom'
                            if(typeof(item.Image) != 'undefined'){
                                if(item.Image.length > 10){
                                    item.Image = item.Image + `?${new Date()}`
                                }
                            }
                        })
                    }
                }
            }

            if(typeof(apiResponse.ForOffers) != 'undefined'){
                if(apiResponse.ForOffers != null){
                    if(apiResponse.ForOffers.length > 0){
                        apiResponse.ForOffers.forEach(item => {
                            if(typeof(item.Image) != 'undefined'){
                                if(item.Image.length > 10){
                                    item.Image = item.Image + `?${new Date()}`
                                }
                            }
                        })
                        offersHeroTiles = apiResponse.ForOffers
                    }
                }
            }



            // if(apiResponse.length > 0){
            //     apiResponse.forEach(item => {
            //         item.arrayItem = 'heroTile'
            //         if(typeof(item.Image) != 'undefined'){
            //             if(item.Image.length > 10){
            //                 item.Image = item.Image + `?${new Date()}`
            //             }
            //         }
            //         if(typeof(item.ForDashboard) != 'undefined'){
            //             if(item.ForDashboard){
            //                 dashboardHeroTiles.push(item)
            //             }else{
            //                 offersHeroTiles.push(item)
            //             }
            //         }
            //     })

            //     if(dashboardHeroTiles.length > 0){
            //         if(typeof(dashboardHeroTiles[0]) != 'undefined'){
            //             dashboardHeroTiles[0].arrayItem = 'heroTile'
            //         }
    
            //         if(dashboardHeroTiles.length > 1){
            //             if(typeof(dashboardHeroTiles[1]) != 'undefined'){
            //                 dashboardHeroTiles[1].arrayItem = 'heroTileBottom'
            //             }
            //         }
            //     }
            // }

            
        }


        // console.warn('Offers: '+ JSON.stringify(offersHeroTiles)) 

        // console.warn('Hero: '+JSON.stringify(apiResponse))

        if(isDashboard){
            dispatch({type:ActionTypes.GET_HERO_TILES_REPONSE,payload:apiResponse})
        }else{
            dispatch({type:ActionTypes.GET_HERO_TILES_OFFERS_REPONSE,payload:offersHeroTiles})
        }
        
        
    }
    catch(e){
      console.log('/////...../////ERROR HERO TILES: '+e.toString())
      isDashboard ? dispatch({type:ActionTypes.GET_HERO_TILES_REPONSE,payload:e,error:true}) : dispatch({type:ActionTypes.GET_HERO_TILES_OFFERS_REPONSE,payload:e,error:true})
    }
},

//get hero titles reset
getHeroTilesReset: () => async (dispatch,getState) => {
  
    dispatch({type:ActionTypes.GET_HERO_TILES_REQUEST})
    try{
        
        dispatch({type:ActionTypes.GET_HERO_TILES_RESET,payload:apiResponse})
    }
    catch(e){
      console.log('/////...../////ERROR: '+e.toString())
        dispatch({type:ActionTypes.GET_HERO_TILES_RESET,payload:e,error:true})
    }
},

//get daily offers reset
getDailyOffersReset: () => async (dispatch,getState) => {
  
    dispatch({type:ActionTypes.GET_DAILY_OFFERS_REQUEST})
    try{
        
        dispatch({type:ActionTypes.GET_DAILY_OFFERS_RESET,payload:apiResponse})
    }
    catch(e){
      console.log('/////...../////ERROR: '+e.toString())
        dispatch({type:ActionTypes.GET_DAILY_OFFERS_RESET,payload:e,error:true})
    }
},

//get popular offers reset
getPopularOffersReset: () => async (dispatch,getState) => {
  
    dispatch({type:ActionTypes.GET_POPULAR_OFFERS_REQUEST})
    try{
        
        dispatch({type:ActionTypes.GET_POPULAR_OFFERS_RESET,payload:apiResponse})
    }
    catch(e){
      console.log('/////...../////ERROR: '+e.toString())
        dispatch({type:ActionTypes.GET_POPULAR_OFFERS_RESET,payload:e,error:true})
    }
},

//get daily offers
getDailyOffers: () => async (dispatch,getState) => {
  
    dispatch({type:ActionTypes.GET_DAILY_OFFERS_REQUEST})
    try{
        const apiResponse = await GenericGetCall(Endpoints.GetDailyOffers,dispatch)

        if(typeof(apiResponse) != 'undefined'){
            if(apiResponse.length > 0){
                apiResponse.forEach(item => {
                    item.arrayItem = 'dailyOffers'
                })
            }
        }

        if(typeof(apiResponse) != 'undefined'){
            if(apiResponse.length > 0){
                apiResponse.forEach(item => {
                    if(typeof(item.Image) != 'undefined'){
                        if(item.Image.length > 10){
                            item.Image = item.Image + `?${new Date()}`
                        }
                    }
                    if(typeof(item.Logo) != 'undefined'){
                        if(item.Logo.length > 10){
                            item.Logo = item.Logo + `?${new Date()}`
                        }
                    }
                })
            }
        }

        console.warn('DAILY: '+JSON.stringify(apiResponse))
        
        dispatch({type:ActionTypes.GET_DAILY_OFFERS_REPONSE,payload:[...apiResponse,...apiResponse,...apiResponse,...apiResponse,...apiResponse]})
    }
    catch(e){
      console.log('/////...../////ERROR Daily: '+e.toString())
        dispatch({type:ActionTypes.GET_DAILY_OFFERS_REPONSE,payload:e,error:true})
    }
},

//get popular offers
getPopularOffers: () => async (dispatch,getState) => {
  
    dispatch({type:ActionTypes.GET_POPULAR_OFFERS_REQUEST})
    try{
        const apiResponse = await GenericGetCall(Endpoints.GetPopularOffers,dispatch)

        if(typeof(apiResponse) != 'undefined'){
            if(apiResponse.length > 0){
                apiResponse.forEach(item => {
                    item.arrayItem = 'popularOffers'
                })
            }
        }

        if(typeof(apiResponse) != 'undefined'){
            if(apiResponse.length > 0){
                apiResponse.forEach(item => {
                    if(typeof(item.Image) != 'undefined'){
                        if(item.Image.length > 10){
                            item.Image = item.Image + `?${new Date()}`
                        }
                    }
                    if(typeof(item.Logo) != 'undefined'){
                        if(item.Logo.length > 10){
                            item.Logo = item.Logo + `?${new Date()}`
                        }
                    }
                })
            }
        }

        console.warn('POPULAR:' +JSON.stringify(apiResponse))
        
        dispatch({type:ActionTypes.GET_POPULAR_OFFERS_REPONSE,payload:[...apiResponse,...apiResponse,...apiResponse,...apiResponse,...apiResponse]})
    }
    catch(e){
      console.log('/////...../////ERROR popular: '+e.toString())
        dispatch({type:ActionTypes.GET_POPULAR_OFFERS_REPONSE,payload:e,error:true})
    }
},

//get challenges
getChallenges: () => async (dispatch,getState) => {
  
    dispatch({type:ActionTypes.GET_CHALLENGES_REQUEST})
    try{
        const apiResponse = await GenericGetCall(Endpoints.GetChallenges,dispatch)
        
        dispatch({type:ActionTypes.GET_CHALLENGES_REPONSE,payload:apiResponse})
    }
    catch(e){
      console.log('/////...../////ERROR: '+e.toString())
        dispatch({type:ActionTypes.GET_CHALLENGES_REPONSE,payload:e,error:true})
    }
},
}