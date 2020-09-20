import { posts } from './posts.js';
import { repos } from './repos.js';
import { badges } from './badges.js';

let shuffle = array => {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    };
    return array;
};

window.app = new Vue({
    el: '#app',
    data: {
        badges,
        cards: shuffle([...posts, ...repos])
    }
});