import express from 'express';
import bodyParser from 'body-parser';
import ejs from 'ejs';


const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static('public'));

app.set('view engine', 'ejs');


//Here I make the array to contain the posts
const posts = [];

//Post constructor
class Post {
    constructor(title, content) {
        this.title = title;
        this.content = content;
        this.date = new Date();
        this.stringDate = this.date.toLocaleString();
    };
};
//Add the Post function
function addPost(title, content) {
    let uppercaseTitle = title.charAt(0).toUpperCase() + title.slice(1);
    let uppercaseContent = content.charAt(0).toUpperCase() + content.slice(1);

    let post = new Post(uppercaseTitle, uppercaseContent);
    
    
    posts.push(post);
    
    
};

//Edit post
function editPost(index, title, content) {
    posts[index] = new Post(title, content);
}

//Delete post
function deletePost(index) {
    posts.splice(index, 1);
}

//Delete all posts
function deleteAll() {

    posts.length = 0;

}


//Here I have the home page
app.get('/', (req, res) => {
  res.render('../partials/home.ejs', {
    posts: posts
  });

});

//Here we go to the post creation page
app.get('/create', (req, res) => {
    res.render('../partials/create.ejs'), {
    }
});


//Here it redirects to the main page when the post is created
app.post('/submit', (req, res) => {
    let title = req.body['title'];
    let post = req.body['post'];

    if (post.trim() !== '' && title.trim() !== '') {
      // Store the content in the blogPosts array
      addPost(title, post);
    } else {
      res.send(`
      <html>
        <body>
          <script>
            alert("You can't let empty the title or post body!!");
            window.history.back(); // Go back to the previous page
          </script>
        </body>
      </html>
    `);
    }

    
    res.redirect('/');
});

//here I open the clicked post
app.get('/view/:id', (req, res) => {
    let index = req.params.id;
    let post = posts[index];
    res.render('../partials/view.ejs', {
        postId: index,
        title: post.title,
        content: post.content
    });
});

app.get('/edit/:id', (req, res) => {
    let index = req.params.id;
    if (index >= 0 && index < posts.length) {
        let post = posts[index];
        res.render('../partials/create.ejs', {
            postId: index,
            title: post.title,
            content: post.content
        });
    } else {
        res.render('../partials/create.ejs'), {
        }
        res.status(404).send('Post not found');
    }
})

app.post('/update', (req, res) => {
    let title = req.body['title'];
    let content = req.body['content'];
    let index = req.body['index'];

    editPost(index, title, content);
    res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
    let index = req.params.id;
    deletePost(index);

    res.redirect('/');
})

app.listen((port), () => {
    console.log(`The server is running on port ${port}`);
});