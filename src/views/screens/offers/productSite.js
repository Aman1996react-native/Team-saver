import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import WView from '../../../components/webView'
export default class ProductSite extends Component {

    render() {
        const { route } = this.props;
        const params = route.params
        return (
            <WView 
            targetUrl={params.targetUrl}
            ClientID={params.ClientID}
            MemberclientTokenId={params.MemberclientTokenId}
            UniqueID={params.UniqueID}
            />
        )
    }
}

const styles = StyleSheet.create({})
