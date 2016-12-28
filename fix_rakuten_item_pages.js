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
        //find the important stuff on the page
        var itemNames = jQuery('.item_name');
        var itemNumberTitles =  jQuery('.item_number_title');
        var itemNumbers =  jQuery('.item_number');
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
            pagebody.before(descriptions[i]);
            descriptions[i].before(baskets[i]);
            baskets[i].before(prices[i]);

            if (itemNumbers.length > 0) {
                prices[i].before(itemNumbers[i]);

                if (itemNumberTitles.length > 0) {
                    itemNumbers[i].before(itemNumberTitles[i]);
                    itemNumberTitles[i].before(itemNames[i]);
                }
                else {
                    itemNumbers[i].before(itemNames[i]);
                }
            }
            else {
                prices[i].before(itemNames[i]);
            }
        }

        //get rid of the useless line breaks in the item titles
        jQuery('.item_name').find('br').remove();

        //remove images to stop Long Page Syndrome
        jQuery("img").hide();

        //grab the main image (probably? merchants aren't consistent) that is relevant to the product
        var images = jQuery('.rakutenLimitedId_ImageMain1-3').find('img');
        if (images.length > 0) {
            jQuery.each(images, function(j, val) {
                jQuery(images[j]).show();
                pagebody.before(images[j]);
            });
        }

        //get rid of the global bg image
        jQuery("body").css({"background":"none"});

        //add line break after the item title
        var br = document.createElement("br");

        for (var k = 0; k < itemNames.length; k++) {
            itemNames[k].appendChild(br);
        }

        //hide the rest of the page
        jQuery('#pagebody').hide();

        //make the description aligned to the right to save some space
        jQuery('[id=rakutenLimitedId_aroundCart]').css("width", "50%");
        jQuery('.item_desc').css("float", "right");
        jQuery('.item_desc').css("width", "50%");

        //hide the useless recommendation area, asuraku table, etc.
        setTimeout(function() {
            jQuery('.susumeruArea').hide();
            jQuery('#asurakuTable').hide();
        }, 1000);
    });
})();
