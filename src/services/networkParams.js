import base64 from 'react-native-base64';

const UserName = '32jkhkh324hg324bnm354mj34bj4m'
const Password = 'Rj845klj4K45Ml45mPO9852GHhm34'
const authString = `${UserName}:${Password}`

export const Auth = `Basic ${base64.encode(authString)}`