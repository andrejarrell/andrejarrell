require('dotenv').config();
let moment = require('moment');
let { map, https, write, parseXML } = require('./utils');

let build = async () => {
    let posts = await https('https://dev.to/feed/andrejarrell')
        .then(async xml => await parseXML(xml))
        .then(json => json.rss.channel.item)
        .then(async items => {
            return await map(items, async post => {
                let slug = post.link.substr(15);
                let stats = await https(`https://dev.to/api/articles/${slug}`)
                    .then(string => JSON.parse(string))
                return {
                    type: 'post',
                    link: post.link,
                    title: post.title,
                    tags: post.category,
                    image: stats.social_image,
                    date: moment(post.pubDate).format('MM/DD/YYYY')
                };
            });
        })
        .then(posts => JSON.stringify(posts, null, 4))
        .then(string => `export let posts = ${string};`)
        .catch(error => console.log(error));

    let headers = {
        'User-Agent': 'Andre\'s Build Tool',
        Accept: 'application/vnd.github.mercy-preview+json',
        Authorization: `Basic ${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
    };

    let repos = await https('https://api.github.com/users/andrejarrell/repos', { headers })
        .then(string => JSON.parse(string))
        .then(repos => repos.filter(r => r.name !== 'andrejarrell'))
        .then(async repos => {
            return await map(repos, async repo => {
                let topics = await https(`${repo.url}/topics`, { headers })
                    .then(string => JSON.parse(string));
                return {
                    type: 'repo',
                    title: repo.name,
                    tags: topics.names,
                    link: repo.html_url,
                    date: moment(repo.created_at).format('MM/DD/YYYY')
                }
            })
        })
        .then(repos => JSON.stringify(repos, null, 4))
        .then(string => `export let repos = ${string};`)
        .catch(error => console.log(error));

    write('src/posts.js', posts)
        .catch(error => console.log(error));

    write('src/repos.js', repos)
        .catch(error => console.log(error));
};

build();