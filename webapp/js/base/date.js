(function ($) {
    $.extend($.fn, {
        sjSelect: function (options) {
            // 默认参数
            var settings = {
                s_year: 2016,
                e_year: new Date().getFullYear()+30,
                index: null,
                cssClass: "lSelect" // 下拉框css名称                       
            };
            $.extend(settings, options);

            return this.each(function () {
                var $this = $(this);
                var MonHead = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                var _selstr = "";
                var _selArr;
                if (typeof ($this.attr("sel")) != "undefined") {
                    _selstr = $this.attr("sel");
                    _selArr = _selstr.split(',');
                    $this.val(_selstr);
                }


                var _rIndex = settings.index == null ? "" + Math.round(Math.random() * 1000000) : settings.index;
                var _allstr = "<select class='" + settings.cssClass + " month" + _rIndex
                    + "'><option vlaue=''>请选择月份</option>";
                for (var k = 1; k <= 12; k++) {
                    _allstr += "<option vlaue='" + k + "'";
                    if (_selstr.length > 0) {
                        if (k == _selArr[1]) {
                            _allstr += " selected";
                        }
                    }
                    _allstr += ">" + k + "</option>";
                }
                _allstr += "</select>" + "<span>月 /</span>";


                _allstr += "<select class='" + settings.cssClass + " year" + _rIndex
                    + "'><option vlaue=''>请选择年份</option>";
                for (var i = settings.s_year; i < settings.e_year; i++) {
                    _allstr += "<option vlaue='" + i + "'";
                    if (_selstr.length > 0) {
                        if (i == _selArr[0]) {
                            _allstr += " selected";
                        }
                    }
                    _allstr += ">" + i + "</option>";
                }
                _allstr += "</select>"+ "<span>年</span>";;




                var n = 0;
                if (_selstr.length > 0) {
                    n = MonHead[_selArr[1] - 1];
                    if (_selArr[1] == 2 && IsPinYear(_selArr[0])) {
                        n++;
                    }

                } else {
                    var _cTime = new Date();
                    var _cMonth = _cTime.getMonth();
                    var _cYear = _cTime.getYear();
                    n = MonHead[_cMonth];
                    if (_cMonth == 1 && IsPinYear(_cYear)) {
                        n++;
                    }
                }

                /*_allstr += "<select class='" + settings.cssClass + " day" + _rIndex
                    + "'><option vlaue=''>请选择日</option>";
                for (var h = 1; h <= n; h++) {
                    _allstr += "<option vlaue='" + h + "'";
                    if (_selstr.length > 0) {
                        if (h == _selArr[2]) {
                            _allstr += " selected";
                        }
                    }
                    _allstr += ">" + h + "日</option>";
                }
                _allstr += "</select>";*/

                $this.after(_allstr);

                function IsPinYear(year) {//判断是否闰平年                       
                    return (0 == year % 4 && (year % 100 != 0 || year % 400 == 0));
                }
                /*function writeDay(n) {     //据条件写日期的下拉框                       
                    var _daystr = "<option vlaue=''>请选择日</option>";
                    for (var i = 1; i <= n; i++) {
                        _daystr += "<option vlaue='" + i + "'>" + i + "日</option>";
                    }
                    $(".day" + _rIndex).html(_daystr);
                }*/
                function getJlSelVal() {
                    var _year_val = $(".year" + _rIndex).val();
                    var _month_val = $(".month" + _rIndex).val();
                    if(_month_val<10){
                    	_month_val="0"+_month_val;
                    }
                    if (_year_val == "请选择年份" || _month_val == "请选择月份" ) {
                        $this.val("");
                    } else {
                           var _lastval = _month_val.substr(0)
                            + "/" +  _year_val.substr(2);
                            /*+ "," + _day_val.substring(0, _day_val.length - 1);*/
                        $this.val(_lastval);
                    }
                }
                /*$(".day" + _rIndex).change(function () {
                    getJlSelVal();
                });*/
                $(".year" + _rIndex).change(function () {//年发生变化时日期发生变化(主要是判断闰平年)
                    var MMvalue = $(".month" + _rIndex).val();
                    if (MMvalue == "请选择月份") {
                        $(".day" + _rIndex).html("<option value=''>请选择日</option>");
                        return;
                    }
                    var n = MonHead[MMvalue.substring(0, MMvalue.length - 1) - 1];
                    var YYval = $(".year" + _rIndex).val();
                    if (MMvalue.substring(0, MMvalue.length - 1) == 2 && IsPinYear(YYval.substring(0, YYval.length - 1))) {
                        n++;
                    }
                    /*writeDay(n);*/
                    getJlSelVal();
                });
                $(".month" + _rIndex).change(function () {//月发生变化时日期联动
                    var YYYYvalue = $(".year" + _rIndex).val();
                    if (YYYYvalue == "请选择年份") {
                        $(".day" + _rIndex).html("<option value=''>请选择日</option>");
                        return;
                    }
                    var MMvalue = $(".month" + _rIndex).val();
                    var _cmon = MMvalue.substring(0, MMvalue.length - 1);
                    var n = MonHead[_cmon - 1];
                    if (_cmon == 2 && IsPinYear(YYYYvalue.substring(0, YYYYvalue.length - 1)))
                        n++;
                    /*writeDay(n);*/
                    getJlSelVal();
                });

            });
        }
    });
})(jQuery);