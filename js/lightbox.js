/**
 * a micro light box Created by heyong on 16/6/15.
 * need import jquery
 * version 0.1.0
 */
(function(window,$){
    var slice=[].slice;

    function LightBox(){
        this.groupImgs={
            groupID:0,
            groups:[],
            length:0
        };
        this.activeData={};
        this.body=$(document).find("body");


    }
    LightBox.fn=LightBox.prototype={
        _renderDom:function(){
            var htmlDom='<div id="lightbox" class="z-closed">'+
                '<div class="m-lightbox-mask"></div>'+
                '<div class="m-lightbox-con">'+
                '<img src="images/pic/2-1.jpg">'+
                '<div class="m-lightbox-info">'+
                '<h6>美丽的西雅图</h6>'+
                '<p>拍摄于2016年6月，午后的风光</p>'+
                '</div>'+
                '<div class="m-lightbox-page"><span id="boxPageNum">2</span>/<span id="boxTotalNum">6</span></div>'+
                '<div class="m-lightbox-prev"></div>'+
                '<div class="m-lightbox-next"></div>'+
                '</div>'+
                '<div class="m-lightbox-close"></div>'+
                '</div>';
            this.body.append(htmlDom);
        },
        init:function(){
            this._renderDom();

            this.lightBox=$("#lightbox");
            this.boxTitle=$(document).find(".m-lightbox-info h6");
            this.boxDesc=$(document).find(".m-lightbox-info p");
            this.boxPageNum=$(document).find("#boxPageNum");
            this.boxTotalNum=$(document).find("#boxTotalNum");
            this.boxImg=$(document).find(".m-lightbox-con img");
            this.boxMask=$(document).find(".m-lightbox-mask");
            this.boxImgPrev=$(document).find(".m-lightbox-prev");
            this.boxImgNext=$(document).find(".m-lightbox-next");

            var self=this;

            $(document).on("click",".lightbox",function(){
                self.getGroupData($(this));
            });
            $(document).on("click",".m-lightbox-close",function(){
                self.lightBox.addClass("z-closed")
            });
            $(document).on("click",".m-lightbox-mask",function(){
                self.lightBox.addClass("z-closed")
            });
            $(document).on("click",".m-lightbox-prev",function(){
                self.prev();
            });
            $(document).on("click",".m-lightbox-next",function(){
                self.next();
            });
        },
        getGroupData:function(target){
            var self=this;
            var imageUrl=target.attr("data-imgsrc");

            var groupName=target.attr("data-group");
            self.groupImgs={
                groupID:0,
                groups:[],
                length:0
            }
            self.groupImgs.groupID=groupName;

            $("img[data-group="+groupName+"]").each(function(index,val){


                self.groupImgs.groups.push({"imgsrc":$(val).attr("data-imgsrc")});

                if(target[0]===val){
                    self.activeData.index=++index;
                }
            });
            self.groupImgs.length=self.groupImgs.groups.length;

            this.activeData.imageUrl=imageUrl;



            this._loadImage(function(){
                var imageW=slice.call(arguments)[0];
                var imageH=slice.call(arguments)[1];
                self.activeData.width=imageW;
                self.activeData.height=imageH;

                self.resize();
                self._updateView();

            });

        },

        resize:function(){
            var self=this;
            var winH=$(window).height();
            var winW=$(window).width();
            var imageW= self.activeData.width;
            var imageH=self.activeData.height;
            var boxMaxHeight=winH-50;
            var boxMaxWidth=winW-50;

            var resizeW=0;
            var resizeH=0;
            $(".m-lightbox-con img").css({
                "width":"auto",
                "height":"auto",
            });

            //宽 高都未超出

            if(imageH<=boxMaxHeight && imageW<=boxMaxWidth){
                resizeH=imageH;
                resizeW=imageW;
            }
            //宽超出 高未超出
            if(imageW>boxMaxWidth && imageH<=boxMaxHeight){
                resizeW=boxMaxWidth;
                resizeH=resizeW/(imageW/imageH);

            }
            //高超出 宽度未超出
            if(imageH>boxMaxHeight && imageW<=boxMaxWidth){
                resizeH=boxMaxHeight;
                resizeW=resizeH/(imageH/imageW);
            }

            //宽度 高 都超出
            if(imageW>boxMaxWidth && imageH>boxMaxHeight){

                if(imageW/boxMaxWidth>imageH/boxMaxHeight){ //宽度
                    resizeW=boxMaxWidth;
                    resizeH=imageH/(imageW/boxMaxWidth);

                }else{
                    resizeH=boxMaxHeight;
                    resizeW=imageW/(imageH/boxMaxHeight);
                }


            }



            $(".m-lightbox-con img").css({
                "width":resizeW+"px",
                "height":resizeH+"px",
            });

            if(resizeW<200){
                resizeW=200;
            }
            $(".m-lightbox-con").css({
                "width":resizeW+"px",
                "height":resizeH+"px",
                "marginLeft":-resizeW/2+"px",
                "marginTop":-resizeH/2+"px"
            })
            $(".m-lightbox-prev").css({
                "top":(resizeH/2-15)+"px",
            })
            $(".m-lightbox-next").css({
                "top":(resizeH/2-15)+"px",
            })
        },

        _loadImage:function(callback){
            var image = new Image();
            image.src = this.activeData.imageUrl;
            image.onload = function(){
                callback(image.width, image.height)
            }
        },
        _updateView:function(){
            var totalNum=this.groupImgs.length;
            var activeIndex=this.activeData.index;
            this.boxImg.attr("src",this.activeData['imageUrl']);
            this.boxTotalNum.html(this.groupImgs.length)
            this.boxPageNum.html(this.activeData.index)
            if(1==activeIndex){
                this.boxImgPrev.hide();
            }else{
                this.boxImgPrev.show();
            }
            if(totalNum==activeIndex){
                this.boxImgNext.hide();
            }else{
                this.boxImgNext.show();
            }

            if(this.lightBox.hasClass("z-closed")){
                this.lightBox.removeClass("z-closed");
            }
        },
        prev:function(){
            var self=this;
            var activeIndex=this.activeData.index;
            var groups=this.groupImgs.groups;

            if(activeIndex>1){
                this.activeData['imageUrl']=groups[(--activeIndex)-1].imgsrc;
                this.activeData['index']=activeIndex;
            }

            this._loadImage(function(){
                var imageW=slice.call(arguments)[0];
                var imageH=slice.call(arguments)[1];
                self.activeData.width=imageW;
                self.activeData.height=imageH;

                self.resize();
                self._updateView();

            });
        },
        next:function(){
            var self=this;
            var totalNum=this.groupImgs.length;
            var activeIndex=this.activeData.index;
            var groups=this.groupImgs.groups;

            if(activeIndex<totalNum){
                this.activeData['imageUrl']=groups[(++activeIndex)-1].imgsrc;
                this.activeData['index']=activeIndex;
            }

            this._loadImage(function(){
                var imageW=slice.call(arguments)[0];
                var imageH=slice.call(arguments)[1];
                self.activeData.width=imageW;
                self.activeData.height=imageH;

                self.resize();
                self._updateView();

            });
        },

    }
    window.LightBox=LightBox;

})(window,$);