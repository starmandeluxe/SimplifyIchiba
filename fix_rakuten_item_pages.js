// ==UserScript==
// @name         Simplify Rakuten Ichiba Item Pages
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fix the damn Ichiba Item Pages
// @author       Alex Kort
// @match        http://item.rakuten.co.jp/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    jQuery(window).load(function() {
        //import bootstrap
        jQuery('head').append('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" type="text/css" />');

        //find the important stuff on the page
        var itemNames = jQuery('.item_name');
        var prices =  jQuery('.rakutenLimitedId_cart');

        //Price area might not be a class. Because Rakuten.
        if (prices.length === 0) {
            prices = jQuery('[id=rakutenLimitedId_cart]');
        }

        var baskets = jQuery('[id=rakutenLimitedId_aroundCart]');
        var descriptions = jQuery('.item_desc');
        var pagebody = jQuery('#pagebody');

        //Now move the important stuff to where you'd expect it should be
        for (var i = 0; i < baskets.length; i++) {
            pagebody.before('<div id="itemSection' + i + '" style="overflow:hidden;"></div>');

            var basketBodyDiv = document.createElement('div');
            basketBodyDiv.setAttribute("id", "basketBody" + i);

            var basketContents = jQuery(baskets[i]).children();
            jQuery.each(basketContents, function(s, val) {
                basketBodyDiv.append(basketContents[s]);
            });

            baskets[i].append(basketBodyDiv);

            var basketHeader = document.createElement('div');
            basketHeader.setAttribute("id", "basketHeader" + i);
            basketHeader.innerHTML = "Cart Options";
            baskets[i].prepend(basketHeader);

            jQuery('#itemSection' + i).append(baskets[i]);

            var descDiv = document.createElement('div');
            descDiv.setAttribute("id", "descSection" + i);

            var descHeader = document.createElement('div');
            descHeader.setAttribute("id", "descHeader" + i);
            descHeader.innerHTML = "Item Description";

            descDiv.append(descHeader);

            var descBodyDiv = document.createElement('div');
            descBodyDiv.setAttribute("id", "descBody" + i);
            descBodyDiv.append(descriptions[i]);
            descDiv.append(descBodyDiv);

            baskets[i].before(descDiv);
            var priceDiv = document.createElement('div');
            priceDiv.setAttribute("id", "priceSection" + i);
            descDiv.before(priceDiv);

            //unwrap the price section table, reconstruct as text only
            var priceContent = jQuery(prices[i]).find('span');
            jQuery.each(priceContent, function(t, val) {
                jQuery('#priceSection' + i).append(priceContent[t]);
            });

            jQuery('#priceSection' + i).before(itemNames[i]);

            //if there are multiple items, break them up with some whitespace
            if (i > 0) {
                jQuery("#itemSection" + i).prepend('<br />');
            }
        }

        //get rid of the useless line breaks in the item titles
        jQuery('.item_name').find('br').remove();

        //remove images to stop Long Page Syndrome
        jQuery("img").hide();

        //bundle the images
        var images = jQuery('.rakutenLimitedId_ImageMain1-3').find('img');

        var imgDiv = document.createElement('div');
        imgDiv.setAttribute("id", "imgSection");
        jQuery(imgDiv).css("margin", "20px");
        jQuery(imgDiv).addClass("panel panel-default");

        var imgHeaderDiv = document.createElement('div');
        imgHeaderDiv.setAttribute("id", "imgSectionHeader");
        imgHeaderDiv.innerHTML = "Images";
        jQuery(imgHeaderDiv).addClass("panel-heading");
        jQuery(imgHeaderDiv).css("text-align", "center");

        var imgBodyDiv = document.createElement('div');
        imgBodyDiv.setAttribute("id", "imgBody");
        jQuery(imgBodyDiv).addClass("panel-body");

        if (images.length > 0) {
            jQuery.each(images, function(j, val) {
                jQuery(images[j]).show();
                imgBodyDiv.append(images[j]);
                //pagebody.before(images[j]);
            });
        }

        imgDiv.append(imgHeaderDiv);
        imgDiv.append(imgBodyDiv);
        pagebody.before(imgDiv);

        //get rid of the global bg image
        jQuery("body").css({"background":"none"});

        //hide the rest of the page
        jQuery('#pagebody').hide();

        //hide the useless recommendation area, asuraku table, etc.
        setTimeout(function() {
            jQuery('div[align=center]').hide();
            jQuery('.susumeruArea').hide();
            jQuery('[id=asurakuTable]').hide();
            //jQuery('.riMb10').hide();
            jQuery('.item_number_title').hide();
            jQuery('.item_number').hide();
        }, 500);


        //and add line breaks after the item titles
        for (var k = 0; k < itemNames.length; k++) {
            var br = document.createElement("br");
            itemNames[k].append(br);
        }

        //make everything beautiful
        jQuery('[id^=descSection]').addClass("panel panel-default");
        jQuery('[id^=descHeader]').addClass("panel-heading");
        jQuery('[id^=basketHeader]').addClass("panel-heading");
        jQuery('[id^=descBody]').addClass("panel-body");
        jQuery('[id^=basketBody]').addClass("panel-body");
        jQuery('.item_name').addClass("panel");
        jQuery('[id=rakutenLimitedId_aroundCart]').addClass("panel panel-default");
        jQuery('select').addClass('form-control');
        jQuery('[id=rakutenLimitedId_aroundCart]').css("float", "left");
        jQuery('[id^=priceSection]').css("text-align", "center");
        jQuery('.item_name').css("display", "table");
        jQuery('.item_name').css("margin", "0 auto");
        jQuery('.item_name').css("padding", "20px");
        jQuery('[id^=descSection]').css("float", "left");
        jQuery('[id^=descSection]').css("margin-right", "20px");
        jQuery('[id^=descSection]').css("margin-left", "20px");

        //add google translate
        jQuery('<script>').attr('type', 'text/javascript')
            .text('function googleTranslateElementInit() { new google.translate.TranslateElement({pageLanguage: \'jp\', layout: google.translate.TranslateElement.InlineLayout.SIMPLE},\'gtranslate\');}')
            .appendTo('head');

        jQuery.getScript("http://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit", function() {
            jQuery('#itemSection0').before('<div id="gtranslate" style="width:100px;padding-bottom:20px;margin:auto;margin-top:-40px;"></div>');
        });
    });
}
)();
