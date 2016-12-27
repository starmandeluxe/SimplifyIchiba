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

    var itemNames = jQuery('.item_name');
    var itemNumberTitles =  jQuery('.item_number_title');
    var itemNumbers =  jQuery('.item_number');
    var prices =  jQuery('.rakutenLimitedId_cart');
    if (prices.length === 0) {
        prices =  jQuery('#rakutenLimitedId_cart');
    }
    var baskets = jQuery('[id=rakutenLimitedId_aroundCart]');
    var pagebody = jQuery('#pagebody');

    for (var i = 0; i < baskets.length; i++)
    {
        pagebody.before(baskets[i]);
        baskets[i].before(prices[i]);
        prices[i].before(itemNumbers[i]);
        itemNumbers[i].before(itemNumberTitles[i]);
        itemNumberTitles[i].before(itemNames[i]);
    }

    jQuery('.item_name').find('br').remove();

    jQuery("img").hide();
})();
