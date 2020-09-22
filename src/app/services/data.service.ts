import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../config/config';
// tslint:disable-next-line: max-line-length
import { StringsObject, TipsObject, UserObject, OptionsObject, SendMailObject} from '../interfaces/interfaces';

const Url = config.Url;

@Injectable({
  providedIn: 'root'
})
export class DataService {

  page = 0;

  constructor( private http: HttpClient ) { }
  private ejectQuery<T>( query: string ) {
    query = Url + query;
    console.log("query", query);
    return this.http.get<T>( query );
  }

  getDataStrings() {
    return this.ejectQuery<StringsObject>('/json/data_strings.php');
  }
  updateUserInfo(id : any) {
    return this.ejectQuery<UserObject[]>(`/json/data_updateuser.php?&id=${id}`);
  }
  updateProfileInfo(value : any) {
    return this.ejectQuery<UserObject[]>(`/json/data_updateprofile.php?&id=${value.id}&email=${value.email}&password=${value.password}&first_name=${value.first_name}&last_name=${value.last_name}&birthday=${value.birthday}`);
  }
  getTipsList(id : any) {
    return this.ejectQuery<TipsObject[]>(`/json/data_tips.php?&id=${id}`);
  }
  getOptions(id : any) {
    return this.ejectQuery<OptionsObject[]>(`/json/data_options.php?&user_id=${id}`);
  }
  getSelectedOptions(value, uid, option_id, option_uid) {
    return this.ejectQuery<OptionsObject[]>(`/json/data_selectoptions.php?&value=${value}&user_id=${uid}&option_id=${option_id}&option_uid=${option_uid}`);
  }
  getTipByDate() {
    return this.ejectQuery<TipsObject[]>('/json/data_tipbydate.php');
  }
  setFavorite(tip_id, user_id, action, fav_id) {
    return this.ejectQuery<TipsObject[]>(`/json/data_tipswithfavorite.php?&tip_id=${tip_id}&user_id=${user_id}&action=${action}&fav_id=${fav_id}`);
  }
  registerNewUser(value: any, token: any) {
    return this.ejectQuery<UserObject[]>(`/json/data_user.php?&first_name=${value.first_name}&last_name=${value.last_name}&phonenumber=${value.phonenumber}&birthday=${value.birthday}&password=${value.password}&email=${value.email}&token=${token}`);
  }
  checkUserExist(value: any) {
      return this.ejectQuery<UserObject[]>(`/json/check_user.php?&email=${value.email}`);
  }  
  getFavoriteTipsList(id : any) {
    return this.ejectQuery<TipsObject[]>(`/json/data_favoritetips.php?&id=${id}`);
  }
  sendEmail(token : any, email : any) {
    return this.ejectQuery<SendMailObject[]>(`/json/data_sendemail.php?&token=${token}&email=${email}`);
  }
}
