(self.webpackChunkadamxyz=self.webpackChunkadamxyz||[]).push([[124],{5124:(e,t,s)=>{"use strict";s.r(t),s.d(t,{PublicProfileModule:()=>D});var i=s(1116),r=s(5959),n=s(878),o=s(7570),c=s(5416),l=s(4689),a=s(9996),u=s(1824),g=s(5366),h=s(7905),p=s(9823),d=s(3464),f=s(8876),m=s(526),v=s(9331),b=s(9624),_=s(5876);const w=["myInput"],U=function(e){return[e]};function S(e,t){if(1&e&&(g.TgZ(0,"li"),g.TgZ(1,"a",11),g._uU(2),g.qZA(),g.qZA()),2&e){const e=t.$implicit,s=t.index,i=g.oxw();g.xp6(1),g.Q6J("routerLink",g.VKq(2,U,i.getUrl(e,s))),g.xp6(1),g.hij(" --\x3e ",e,"")}}function x(e,t){if(1&e&&(g.TgZ(0,"span",15),g._uU(1),g.qZA()),2&e){const e=g.oxw(3);g.xp6(1),g.Oqu(e.getContentsCount(e.myUser))}}function y(e,t){if(1&e){const e=g.EpF();g.TgZ(0,"button",14,17),g.NdJ("click",function(){return g.CHM(e),g.oxw(2).contents()}),g._uU(2,"\u0130\xe7erikler: "),g.YNc(3,x,2,1,"span",18),g.qZA()}if(2&e){const e=g.oxw(2);g.xp6(3),g.Q6J("ngIf",!e.location.isCurrentPathEqualTo("/user/edit"))}}function C(e,t){if(1&e&&(g.TgZ(0,"label",19),g._uU(1,"G\xf6r\xfcnt\xfcleme: "),g.TgZ(2,"span",15),g._uU(3),g.qZA(),g.qZA()),2&e){const e=t.ngIf,s=g.oxw(2);g.xp6(3),g.Oqu(e.key=="@"+s.myUser.id?e.value:s.newsCounts.get("@"+s.myUser.id))}}function Z(e,t){if(1&e){const e=g.EpF();g.TgZ(0,"div",20),g.TgZ(1,"button",21),g.NdJ("click",function(){g.CHM(e);const t=g.oxw(2);return t.tagClick(t.myUser)}),g._uU(2),g.qZA(),g.qZA()}if(2&e){const e=g.oxw(2);g.xp6(2),g.Oqu(e.userService.dbUser.users.includes(e.myUser.id)?"Takibi Kes":"Takip Et")}}function O(e,t){if(1&e){const e=g.EpF();g.TgZ(0,"div",20),g.TgZ(1,"button",21),g.NdJ("click",function(){g.CHM(e);const t=g.oxw(2);return t.deleteClick(t.myUser)}),g._uU(2,"Hesab\u0131m\u0131 Sil"),g.qZA(),g.qZA()}}function k(e,t){if(1&e){const e=g.EpF();g.TgZ(0,"div"),g.YNc(1,y,4,1,"button",12),g._UZ(2,"br"),g.YNc(3,C,4,1,"label",13),g.ALo(4,"async"),g._UZ(5,"br"),g.TgZ(6,"button",14),g.NdJ("click",function(){g.CHM(e);const t=g.oxw();return t.proClick(t.myUser.users)}),g._uU(7,"Takip Edilen Ki\u015filer "),g.TgZ(8,"span",15),g._uU(9),g.qZA(),g.qZA(),g._UZ(10,"br"),g.TgZ(11,"button",14),g.NdJ("click",function(){g.CHM(e);const t=g.oxw();return t.followTags(t.myUser.tags)}),g._uU(12,"Takip Edilen Etiketler "),g.TgZ(13,"span",15),g._uU(14),g.qZA(),g.qZA(),g._UZ(15,"br"),g.TgZ(16,"button",14),g.NdJ("click",function(){return g.CHM(e),g.oxw().mineOffers()}),g._uU(17,"Yapt\u0131\u011f\u0131m Teklifler "),g.TgZ(18,"span",15),g._uU(19),g.qZA(),g.qZA(),g._UZ(20,"br"),g.TgZ(21,"button",14),g.NdJ("click",function(){g.CHM(e);const t=g.oxw();return t.proClick(t.myUser.followers)}),g._uU(22,"Takip\xe7iler "),g.TgZ(23,"span",15),g._uU(24),g.qZA(),g.qZA(),g._UZ(25,"br"),g.YNc(26,Z,3,1,"div",16),g.YNc(27,O,3,0,"div",16),g.qZA()}if(2&e){const e=g.oxw();g.xp6(1),g.Q6J("ngIf",!e.location.isCurrentPathEqualTo("/user/edit")),g.xp6(2),g.Q6J("ngIf",g.lcZ(4,8,e.service.newsStreamCounts$)),g.xp6(6),g.Oqu(e.myUser.users?e.myUser.users.length:0),g.xp6(5),g.Oqu(e.myUser.tags?e.myUser.tags.length:0),g.xp6(5),g.Oqu(e.getPeopleOffers()),g.xp6(5),g.Oqu(e.myUser.followers?e.myUser.followers.length:0),g.xp6(2),g.Q6J("ngIf",e.userService.dbUser&&e.myUser.id!==e.userService.dbUser.id),g.xp6(1),g.Q6J("ngIf",e.location.path().startsWith("/user/edit"))}}function M(e,t){if(1&e&&(g.TgZ(0,"section",22),g._UZ(1,"app-profile-center",23),g._UZ(2,"router-outlet"),g.qZA()),2&e){const e=g.oxw();g.xp6(1),g.Q6J("username",e.myUser.id)("boolUser",e.boolUser)("user",e.myUser)("userIds",e._userIds)("tagz",e.tags)("isPub",e._isPub)("ngStyle",e.compStyle)}}let I=(()=>{class e{constructor(e,t,s,i,c,l,a,u,g){this.userService=e,this.reactiveService=t,this.route=s,this.authService=i,this.location=c,this.winRef=l,this.renderer=a,this.service=u,this.domSanitizer=g,this.onDestroy=new r.xQ,this._isPub=(0,n.of)(!0),this._prof_url="/assets/profile-img.jpeg",this._back_url="/assets/back-img.jpeg",this._userIds=[],this.folli=!1,this.subscription_newslist=new o.w,this.isMobile=!1,this.orderBy="date",this._boolUser=(0,n.of)(0),this.controller=new AbortController,this.signal=this.controller.signal,this.loggedID="",this.listStyle={},this.compStyle={},this.reactiveService.random||(this.reactiveService.random=Math.floor(899999*Math.random())+1e5),this.newslistUrl="/sse/chat/room/TopNews"+this.reactiveService.random+"/subscribeMessages"}set value(e){e&&(this.myInput=e,this.renderer.addClass(this.myInput.nativeElement,"active"))}get username(){return this._username}set username(e){this._username=e}get newsCounts(){return this.service.newsCounts}ngOnInit(){this.reactiveService.statusOfNewsSource()||this.reactiveService.getNewsStream(this.reactiveService.random,this.newslistUrl),this.loggedID=window.history.state.loggedID,this._username=window.history.state.userID,this._user=this.userService._otherUser;const e=this.winRef.nativeWindow.innerWidth;let t="0px",s="0px";this.isMobile=this.winRef.nativeWindow.innerWidth<620,this.isMobile?(s=(e>390?(e-390)/2:e/20)+"px",t=(e>390?3*e/350:e/20)+"px"):t=3*e/350+"px",this.listStyle={minWidth:this.isMobile?"auto":"390px",marginRight:t,marginLeft:s},this.compStyle={width:e>1050?2*e/3*e/1600+"px":this.isMobile?"100vw":"62vw",overflow:"hidden",marginTop:"17px"},this.route.paramMap.pipe((0,c.R)(this.onDestroy),(0,l.w)(e=>{const t=e.get("id");return t&&(this._username=t),this.username=this._username.includes("@")?this._username:"#"+this._username,this.findMother()}),(0,l.w)(e=>{this.reactiveService.setOtherListener("@"+this.userID);const t=this.reactiveService.publicStreamList$.get(this.userID);if(t){this.reactiveService.getNewsSubject("other").next(t);const e=this.reactiveService.publicOfferList$.get(this.userID);e&&this.reactiveService.getOffersSubject("other").next(e)}return this.service.setNewsUser("@"+this.userID,this.reactiveService.random)})).subscribe(e=>{console.log("findMother : ",e)})}tagClick(e){this.folli?this.userService.manageFollowingTag("@"+e.id,!1).pipe((0,c.R)(this.onDestroy)).subscribe(t=>{var s;if(this.folli=!t,this.userService.dbUser){const t=e.followers.indexOf(this.userService.dbUser.id);e.followers.splice(t,1),null===(s=this.userService.newsCo.get(this.userService.links[2]))||void 0===s||s.splice(t,1),this._user=(0,n.of)(e)}}):this.userService.manageFollowingTag("@"+e.id,!0).pipe((0,c.R)(this.onDestroy)).subscribe(t=>{var s;this.folli=t,this.userService.dbUser&&(e.followers.push(this.userService.dbUser.id),null===(s=this.userService.newsCo.get(this.userService.links[2]))||void 0===s||s.push("@"+e.id),this._user=(0,n.of)(e))})}getNewsByOwner(e){return this.orderBy="date",this.service.getNewsByOwnerId(e)}ngAfterViewInit(){this.userService.loggedUser||this._username||this.authService.getCurrentUser().then(e=>{e&&(this.userService.user=new u.Q,this.userService.user.image=e.providerData[0].photoURL,this.userService.user.email=e.providerData[0].email,this.userService.user.name=e.displayName,this.userService.user.id=e.uid,this.userService.user.token=e.ra,e.getIdToken().then(e=>{this.userService.user&&(this.userService.user.token=e)}),this.userService.loggedUser=this.userService.user,this.loggedID=this.loggedID?this.loggedID:e.uid.substring(0,12),this.userService._otherUser||this.findMother().toPromise().then(e=>{this.reactiveService.setOtherListener("@"+this.userID);const t=this.reactiveService.publicStreamList$.get(this.userID);return t&&this.reactiveService.getNewsSubject("other").next(t),this.service.setNewsUser("@"+this.userID,this.reactiveService.random).toPromise()}).then(e=>console.log("findMother : ",e)))}).catch(e=>{this.loggedID="",this.userService._otherUser||(this._user=this.userService._otherUser=this.findMother())})}ngOnDestroy(){this.location.path().includes("/allusers")||(this.userService._otherUser=(0,n.of)(null)),this.onDestroy.next(),this.onDestroy.complete()}get prof_url(){return this._prof_url}set prof_url(e){this._prof_url=e}get back_url(){return this._back_url}set back_url(e){this._back_url=e}get boolUser(){return this._boolUser}set boolUser(e){this._boolUser=e}proClick(e){this.renderer.removeClass(this.myInput.nativeElement,"active"),this._userIds=e,this.boolUser=(0,n.of)(2)}roleClick(e){e.roles=e.roles.includes("ROLE_USER")?["ROLE_MODERATOR"]:["ROLE_USER"],this.userService.updateUser(e).pipe((0,c.R)(this.onDestroy)).subscribe()}deleteClick(e){this.userService.deleteUser(e).pipe((0,c.R)(this.onDestroy)).subscribe()}blockClick(e){this.userService.dbUser&&this.userService.blockUser(e,this.userService.dbUser.blocked.includes(e.id)).pipe((0,c.R)(this.onDestroy)).subscribe()}findMother(){const e="/api/rest/users/get/"+encodeURIComponent(this._username)+"/"+(this.loggedID?this.loggedID:"a")+"/"+this.reactiveService.random;return this.userService.getDbUser(e).pipe((0,a.U)(e=>{if(!e.id)return this.prof_url="https://storage.googleapis.com/sentral-news-media/profile-img.jpeg",this.back_url="https://storage.googleapis.com/sentral-news-media/back-img.jpeg",this.boolUser=(0,n.of)(0),null;{this.userID=e.id;const t=e.mediaParts.length;e.mediaParts.forEach(s=>{const i=1===s?"back-img.jpeg":"profile-img.jpeg";1===s?(this.back_url="https://storage.googleapis.com/sentral-news-media/"+e.id+"-"+i,1===t&&(this.prof_url="https://storage.googleapis.com/sentral-news-media/"+i)):0===s&&(this.prof_url="https://storage.googleapis.com/sentral-news-media/"+e.id+"-"+i,1===t&&(this.back_url="https://storage.googleapis.com/sentral-news-media/"+i))}),0===t&&(this.prof_url="/assets/profile-img.jpeg",this.back_url="/assets/back-img.jpeg"),this.folli=null!=this.userService.loggedUser&&this.userService.loggedUser.people.includes(e.id),this.boolUser=(0,n.of)(0)}return this.myUser=e,this._user=this.userService._otherUser=(0,n.of)(e),e}))}get tags(){return this._tags}set tags(e){this._tags=e}followTags(e){this.tags=(0,n.of)(e),this.boolUser=(0,n.of)(3),this.renderer.removeClass(this.myInput.nativeElement,"active")}contents(){this.boolUser=(0,n.of)(0)}mineOffers(){this.boolUser=(0,n.of)(8)}getContentsCount(e){return this.reactiveService.getNewsSubject("other").value.length}getPeopleOffers(){return this.reactiveService.getOffersSubject("other").value.length}getUrl(e,t){let s="./";for(let i=1;i<this.service.getPathsList().length;i++){const e=this.service.getPathsList()[i];i<t&&(s+=e+"/")}return t>0?s+e:s}}return e.\u0275fac=function(t){return new(t||e)(g.Y36(h.K),g.Y36(p.r),g.Y36(d.gz),g.Y36(f.e),g.Y36(i.Ye),g.Y36(m.X),g.Y36(g.Qsj),g.Y36(v.Y),g.Y36(b.H7))},e.\u0275cmp=g.Xpm({type:e,selectors:[["app-public-profile"]],viewQuery:function(e,t){if(1&e&&g.Gf(w,5),2&e){let e;g.iGM(e=g.CRH())&&(t.value=e.first)}},inputs:{username:"username"},decls:17,vars:5,consts:[["id","user-profile"],[1,"top"],[1,"figure"],["src","assets/back-img.jpeg","width","1351px","height","225px","alt","asel",1,"image-bg"],["src","assets/profile-img.jpeg","width","192px","height","192px","alt","masel",1,"image-profile"],[1,"paths"],[4,"ngFor","ngForOf"],[1,"side"],[1,"resume"],[4,"ngIf"],["class","center",4,"ngIf"],[3,"routerLink"],["class","followee",3,"click",4,"ngIf"],["style","margin: 5px 0;",4,"ngIf"],[1,"followee",3,"click"],[2,"float","right"],["style","text-align: center; padding-top: 10px",4,"ngIf"],["myInput",""],["style","float: right",4,"ngIf"],[2,"margin","5px 0"],[2,"text-align","center","padding-top","10px"],[1,"butto","ripple","button-outline",3,"click"],[1,"center"],[3,"username","boolUser","user","userIds","tagz","isPub","ngStyle"]],template:function(e,t){1&e&&(g.TgZ(0,"main",0),g.TgZ(1,"section",1),g.TgZ(2,"figure",2),g._UZ(3,"img",3),g._UZ(4,"img",4),g.qZA(),g.qZA(),g.TgZ(5,"section",5),g.TgZ(6,"ol"),g.YNc(7,S,3,4,"li",6),g.ALo(8,"async"),g.qZA(),g.qZA(),g.TgZ(9,"section",7),g.TgZ(10,"article",8),g.TgZ(11,"h1"),g._uU(12,"\xd6zge\xe7mi\u015f"),g.qZA(),g.TgZ(13,"p"),g._uU(14,"Burada d\xfcnyaya geldi. Bu d\xfcnyada yeti\u015fti."),g.qZA(),g.qZA(),g.YNc(15,k,28,10,"div",9),g.qZA(),g.YNc(16,M,3,7,"section",10),g.qZA()),2&e&&(g.xp6(7),g.Q6J("ngForOf",g.lcZ(8,3,t.service.getBreadcrumbList())),g.xp6(8),g.Q6J("ngIf",t.myUser),g.xp6(1),g.Q6J("ngIf",t.myUser))},directives:[i.sg,i.O5,d.yS,_.W,i.PC,d.lC],pipes:[i.Ov],styles:['#user-profile[_ngcontent-%COMP%]{width:100%;display:grid;grid-template:"a a" auto "d d" auto "b c" 1fr/1fr 2fr}section.top[_ngcontent-%COMP%]{grid-area:a;position:relative;display:grid;place-items:center}section.top[_ngcontent-%COMP%]   figure.figure[_ngcontent-%COMP%]{position:relative;height:calc(321 * (100vw / 1536))}section.top[_ngcontent-%COMP%]   figure.figure[_ngcontent-%COMP%]   .image-bg[_ngcontent-%COMP%]{height:calc(225 * (100vw / 1536));max-width:100%;object-fit:cover}section.top[_ngcontent-%COMP%]   figure.figure[_ngcontent-%COMP%]   .image-profile[_ngcontent-%COMP%]{position:absolute;bottom:0;left:5%;height:calc(192 * (100vw / 1536));width:calc(192 * (100vw / 1536));border-radius:50%}section.paths[_ngcontent-%COMP%]{grid-area:d;padding-left:34vw}section.paths[_ngcontent-%COMP%]   ol[_ngcontent-%COMP%]{list-style-type:none;display:flex}section.paths[_ngcontent-%COMP%]   ol[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{text-decoration:none}section.side[_ngcontent-%COMP%]{grid-area:b;padding:.5rem .75rem;background-color:#efefef}section.center[_ngcontent-%COMP%], section.side[_ngcontent-%COMP%]{position:relative;display:flex;flex-direction:column}section.center[_ngcontent-%COMP%]{grid-area:c;padding-bottom:1.5rem}button.followee[_ngcontent-%COMP%]{cursor:pointer;flex-basis:50px;width:100%;margin:.25rem 0;border:none;box-shadow:1px 1px #cbcbcb;font-size:calc(15px + (26 - 14) * ((100vw - 300px) / (1600 - 300)))!important}.active[_ngcontent-%COMP%], button.followee[_ngcontent-%COMP%]:active, button.followee[_ngcontent-%COMP%]:focus, button.followee[_ngcontent-%COMP%]:hover{background:#fff}article.resume[_ngcontent-%COMP%]{padding:1rem;background:snow;margin:0 0 1rem}article.resume[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{text-align:center}@media screen and (max-width:600px){#user-profile[_ngcontent-%COMP%]{grid-template:"a" auto "a" auto "d" auto "b" auto "c" 1fr/1fr;grid-gap:.25rem;gap:.25rem}section.paths[_ngcontent-%COMP%]{padding-left:5vw}}']}),e})();var P=s(5558),T=s(8346),q=s(4166);const A=[{path:"",component:I,children:[{path:"news-details/:id",component:T.Y},{path:"upload",component:q.r}]}];let D=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=g.oAB({type:e}),e.\u0275inj=g.cJS({providers:[],imports:[[i.ez,d.Bz.forChild(A),P.x]]}),e})()}}]);