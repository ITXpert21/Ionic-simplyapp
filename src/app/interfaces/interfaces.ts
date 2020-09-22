export interface StringsObject {
  st_privacypolicy: any;
  st_termsofservice: any;
  st_aboutus: any;
}

export interface UserObject {
  id: number;
  username: string;
  password: string;
  email : string;
  role : number;
  unreadcount : number;
  notifications : string,
  paid_lastdate : string,
  paid : number,
  token : string
}
export interface TipsObject {
  id: number;
  tip_title: string;
  tip_text: string;
  tip_image : string;
  tip_video : string;
  tip_videothumbimage : string;
  start : string,
  end : string,
  favorite : boolean,
  fav_id : number,
  action : string,
  title_date : Date
}
export interface SendMailObject {
  isSent : boolean
}
export interface OptionsObject {
  id: number;
  option_name: string;
  value: number,
  uid : number
}

