/**
 * a micro light box Created by heyong on 16/6/15.
 * need jquery
 * version 0.1.1
 */
(function (window, $) {
    var slice = [].slice;

    function LightBox() {
        this.groupImgs = {
            groupID: 0,
            groups: [],
            length: 0
        };
        this.activeData = {
            "imgsrc": "",
            "title": "",
            "desc": "",
            "index": 0
        };
        this.body = $(document).find("body");


    }

    LightBox.fn = LightBox.prototype = {
        _renderDom: function () {
            var htmlDom =
                '<div class="m-lightbox-mask" style="display: none"></div>' +
                '<div class="m-lightbox-con" style="display: none">' +
                '<img class="m-lightbox-img" src="">' +

                '<div class="m-lightbox-info" style="display: none">' +
                '<h6></h6>' +
                '<p></p>' +
                '</div>' +
                '<div class="m-lightbox-loading"><i></i></div>' +
                '<div class="m-lightbox-page" style="display: none"><span id="boxPageNum">2</span>/<span id="boxTotalNum">6</span></div>' +
                '</div>' +
                '<div class="m-lightbox-close" style="display: none"></div>' +
                '<div class="m-lightbox-prev" style="display: none"></div>' +
                '<div class="m-lightbox-next" style="display: none"></div>';
            this.body.append(htmlDom);
        },
        init: function () {
            this._renderDom();

            this.boxInfo = $(document).find(".m-lightbox-info");

            this.boxTitle = $(document).find(".m-lightbox-info h6");
            this.boxDesc = $(document).find(".m-lightbox-info p");
            this.boxPage = $(document).find(".m-lightbox-page");
            this.boxMask = $(document).find(".m-lightbox-mask");

            this.boxPageNum = $(document).find("#boxPageNum");
            this.boxTotalNum = $(document).find("#boxTotalNum");
            this.boxCon = $(document).find(".m-lightbox-con");

            this.boxImg = $(document).find(".m-lightbox-img");
            this.boxImgPrev = $(document).find(".m-lightbox-prev");
            this.boxImgNext = $(document).find(".m-lightbox-next");
            this.boxLoading = $(document).find(".m-lightbox-loading");
            this.boxClose= $(document).find(".m-lightbox-close");

            var self = this;

            $(document).on("click", ".lightbox", function () {
                self.getGroupData($(this));
            });
            $(document).on("click", ".m-lightbox-close", function () {
                self._setConSizeSmall();
                self._close();
            });
            $(document).on("click", ".m-lightbox-mask", function () {
                self._setConSizeSmall();
                self._close();
            });
            $(document).on("click", ".m-lightbox-prev", function () {
                self.prev();
            });
            $(document).on("click", ".m-lightbox-next", function () {
                self.next();
            });
            $(window).resize(function () {
                self.resize();
            });
        },
        _show: function () {
            this.boxCon.show();

            this.boxInfo.hide();
            this.boxPage.hide();
            this.boxImgPrev.show();
            this.boxImgNext.show();
            this.boxMask.show();
            this.boxClose.show();
        },
        _showInfo:function(){
            this.boxInfo.show();
            this.boxPage.show();
        },
        _close:function(){


            this.boxInfo.hide();
            this.boxPage.hide();
            this.boxImgPrev.hide();
            this.boxImgNext.hide();
            this.boxMask.hide();
            this.boxClose.hide();

            setTimeout(function(){
                this.boxCon.hide();
            }.bind(this),600);
        },
        _setConSizeSmall:function(){
            var activeDom=this.activeData.dom;


            var offsetLeft=activeDom.offset().left-$(window).scrollLeft();
            var offsetTop=activeDom.offset().top-$(window).scrollTop();



            var imgW=activeDom.width();
            var imgH=activeDom.height();
            this.boxCon.css({
                "position":"fixed",
                "left":offsetLeft,
                "top":offsetTop,
                "width":imgW,
                "height":imgH,
                "margin":0
            })
            this.boxImg.css({
                "width":imgW,
                "height":imgH,
            });
        },
        getGroupData: function (target) {
            var self = this;
            var imgsrc = target.attr("data-imgsrc");
            var title = target.attr("data-title");
            var desc = target.attr("data-desc");

            var groupName = target.attr("data-group");
            self.groupImgs = {
                groupID: 0,
                groups: [],
                length: 0
            }
            self.groupImgs.groupID = groupName;

            $("img[data-group=" + groupName + "]").each(function (index, val) {
                self.groupImgs.groups.push(
                    {
                        "dom":$(val),
                        "imgsrc": $(val).attr("data-imgsrc"),
                        "title": $(val).attr("data-title"),
                        "desc": $(val).attr("data-desc")
                    }
                );

                if (target[0] === val) {
                    self.activeData.index = ++index;
                }
            });
            self.groupImgs.length = self.groupImgs.groups.length;
            self.activeData.dom=target;
            self.activeData.imgsrc = imgsrc;
            self.activeData.title = title;
            self.activeData.desc = desc;
            this._setConSizeSmall();
            this.boxImg.attr("src", imgsrc);
            self._show();

            this._loadImage(0,function () {
                var imageW = slice.call(arguments)[0];
                var imageH = slice.call(arguments)[1];
                self.activeData.width = imageW;
                self.activeData.height = imageH;

                self.resize();
                setTimeout(function(){
                    self._showInfo();
                    self._updateView();
                },600);

            });

        },

        resize: function () {
            var self = this;
            var winH = $(window).height();
            var winW = $(window).width();
            var imageW = self.activeData.width;
            var imageH = self.activeData.height;
            var boxMaxHeight = winH - 50;
            var boxMaxWidth = winW - 50;

            var resizeW = 0;
            var resizeH = 0;
            this.boxImg.css({
                "width": "auto",
                "height": "auto",

            });

            //宽 高都未超出

            if (imageH <= boxMaxHeight && imageW <= boxMaxWidth) {
                resizeH = imageH;
                resizeW = imageW;
            }
            //宽超出 高未超出
            if (imageW > boxMaxWidth && imageH <= boxMaxHeight) {
                resizeW = boxMaxWidth;
                resizeH = resizeW / (imageW / imageH);

            }
            //高超出 宽度未超出
            if (imageH > boxMaxHeight && imageW <= boxMaxWidth) {
                resizeH = boxMaxHeight;
                resizeW = resizeH / (imageH / imageW);
            }

            //宽度 高 都超出
            if (imageW > boxMaxWidth && imageH > boxMaxHeight) {

                if (imageW / boxMaxWidth > imageH / boxMaxHeight) { //宽度
                    resizeW = boxMaxWidth;
                    resizeH = imageH / (imageW / boxMaxWidth);

                } else {
                    resizeH = boxMaxHeight;
                    resizeW = imageW / (imageH / boxMaxHeight);
                }


            }


            this.boxImg.css({
                "width": resizeW + "px",
                "height": resizeH + "px",

            });

            if (resizeW < 200) {
                resizeW = 200;
            }
            this.boxCon.css({
                "position":"fixed",
                "width": resizeW + "px",
                "height": resizeH + "px",
                "left":"50%",
                "top":"50%",
                "marginLeft": -resizeW / 2 + "px",
                "marginTop": -resizeH / 2 + "px"
            })

        },

        _loadImage: function (type,callback) {
            var self = this;
            this.boxLoading.show();
            var image = new Image();

            image.src = this.activeData.imgsrc;
            image.onload = function () {
                callback(image.width, image.height);

                if(type==1){
                    setTimeout(function(){
                        self.boxLoading.hide();
                    },600)
                }else{
                    self.boxLoading.hide();
                }

            }
        },
        _updateView: function () {
            var totalNum = this.groupImgs.length;
            var activeIndex = this.activeData.index;
            this.boxImg.attr("src", this.activeData.imgsrc);
            this.boxTitle.html(this.activeData.title ? this.activeData.title : "");
            this.boxDesc.html(this.activeData.desc ? this.activeData.desc : "");

            this.activeData.title?this.boxInfo.show():this.boxInfo.hide();


            this.boxTotalNum.html(this.groupImgs.length);
            this.boxPageNum.html(this.activeData.index);

           // this._show();

        },

        prev: function () {
            var self = this;
            var activeIndex = this.activeData.index;
            var groups = this.groupImgs.groups;

            if (activeIndex > 1) {
                var arrIndex = (--activeIndex) - 1;

            }else{
                var arrIndex = groups.length-1;
            }
            this.activeData.dom = groups[arrIndex].dom;

            this.activeData.imgsrc = groups[arrIndex].imgsrc;
            this.activeData.index = arrIndex+1;
            this.activeData.title = groups[arrIndex].title;
            this.activeData.desc = groups[arrIndex].desc;

            this._loadImage(1,function () {
                var imageW = slice.call(arguments)[0];
                var imageH = slice.call(arguments)[1];
                self.activeData.width = imageW;
                self.activeData.height = imageH;

                self.resize();
                self._updateView();

            });
        },
        next: function () {
            var self = this;
            var totalNum = this.groupImgs.length;
            var activeIndex = this.activeData.index;
            var groups = this.groupImgs.groups;

            if (activeIndex < totalNum) {
                var arrIndex = (++activeIndex) - 1;
            }else{
                var arrIndex = 0;
            }
            this.activeData.dom = groups[arrIndex].dom;
            this.activeData.imgsrc = groups[arrIndex].imgsrc;
            this.activeData.index = arrIndex+1;
            this.activeData.title = groups[arrIndex].title;
            this.activeData.desc = groups[arrIndex].desc;

            this._loadImage(1,function () {
                var imageW = slice.call(arguments)[0];
                var imageH = slice.call(arguments)[1];
                self.activeData.width = imageW;
                self.activeData.height = imageH;

                self.resize();
                self._updateView();

            });
        }

    };
    window.LightBox = LightBox;

})(window, $);