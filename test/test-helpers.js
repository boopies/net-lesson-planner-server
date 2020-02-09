

const bcrypt = require('bcryptjs')

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      email: 'TU1@test.com',
      password: 'password',
    },
    {
      id: 2,
      user_name: 'test-user-2',
      email: 'TU2@test.com',
      password: 'password',
    },
    {
      id: 3,
      user_name: 'test-user-3',
      email: 'TU3@test.com',
      password: 'password',
    },
    {
      id: 4,
      user_name: 'test-user-4',
      email: 'TU4@test.com',
      password: 'password',
    },
  ]
}

function makeCategoriesArray() {
    return [
      {
        id: 1,
        title: "Test cat 01"
      },
      {
        id: 2,
        title: "Test cat 02",
      },
      {
        id: 3,
        title: "Test cat 03",
      },
      {
        id: 4,
        title: "Test cat 04",
      },
    ]
  }


function makeActivitiesArray(users, category) {
  return [
    {
      id: 1,
      title: 'First test activity!',
      category_id: categories[0].id,
      user_id: users[0].id,
      duration: '5min'
      grouping: 'Groups'
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
        id: 2,
        title: 'Second test activity!',
        category_id: categories[1].id,
        user_id: users[1].id,
        duration: '5min'
        grouping: 'Groups'
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      },
      {
        id: 3,
        title: 'Third test activity!',
        category_id: categories[2].id,
        user_id: users[2].id,
        duration: '5min'
        grouping: 'Groups'
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      },
      {
        id: 4,
        title: 'Fourth test activity!',
        category_id: categories[3].id,
        user_id: users[3].id,
        duration: '5min'
        grouping: 'Groups'
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      },
  ]
}

function makeExpectedActivity(users, activities, categories) {
  const creator = users
    .find(user => user.id === activities.user_id)

  const whichcat = categories
    .find(category => category.id === activities.category_id)

  return {
    id: article.id,
    style: article.style,
    title: article.title,
    content: article.content,
    date_created: article.date_created.toISOString(),
    number_of_comments,
    author: {
      id: author.id,
      user_name: author.user_name,
      full_name: author.full_name,
      nickname: author.nickname,
      date_created: author.date_created.toISOString(),
      date_modified: author.date_modified || null,
    },
  }
}

function makeExpectedArticleComments(users, articleId, comments) {
  const expectedComments = comments
    .filter(comment => comment.article_id === articleId)

  return expectedComments.map(comment => {
    const commentUser = users.find(user => user.id === comment.user_id)
    return {
      id: comment.id,
      text: comment.text,
      date_created: comment.date_created.toISOString(),
      user: {
        id: commentUser.id,
        user_name: commentUser.user_name,
        full_name: commentUser.full_name,
        nickname: commentUser.nickname,
        date_created: commentUser.date_created.toISOString(),
        date_modified: commentUser.date_modified || null,
      }
    }
  })
}

function makeMaliciousArticle(user) {
  const maliciousArticle = {
    id: 911,
    style: 'How-to',
    date_created: new Date(),
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    author_id: user.id,
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  }
  const expectedArticle = {
    ...makeExpectedArticle([user], maliciousArticle),
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousArticle,
    expectedArticle,
  }
}

function makeArticlesFixtures() {
  const testUsers = makeUsersArray()
  const testArticles = makeArticlesArray(testUsers)
  const testComments = makeCommentsArray(testUsers, testArticles)
  return { testUsers, testArticles, testComments }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        blogful_articles,
        blogful_users,
        blogful_comments
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE blogful_articles_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE blogful_users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE blogful_comments_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('blogful_articles_id_seq', 0)`),
        trx.raw(`SELECT setval('blogful_users_id_seq', 0)`),
        trx.raw(`SELECT setval('blogful_comments_id_seq', 0)`),
      ])
    )
  )
}

function seedUsers(db, users) {
     const preppedUsers = users.map(user => ({
       ...user,
       password: bcrypt.hashSync(user.password, 1)
     }))
     return db.into('net_users').insert(preppedUsers)
       .then(() =>
         // update the auto sequence to stay in sync
         db.raw(
           `SELECT setval('blogful_users_id_seq', ?)`,
           [users[users.length - 1].id],
         )
       )
   }

function seedArticlesTables(db, users, articles, comments=[]) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('blogful_articles').insert(articles)
    // update the auto sequence to match the forced id values
    await trx.raw(
        `SELECT setval('blogful_articles_id_seq', ?)`,
        [articles[articles.length - 1].id],
           )
    // only insert comments if there are some, also update the sequence counter
    if (comments.length) {
      await trx.into('blogful_comments').insert(comments)
      await trx.raw(
        `SELECT setval('blogful_comments_id_seq', ?)`,
        [comments[comments.length - 1].id],
      )
    }
  })
}

function seedMaliciousArticle(db, user, article) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('blogful_articles')
        .insert([article])
    )
}

function makeAuthHeader(user) {
   const token = Buffer.from(`${user.user_name}:${user.password}`).toString('base64')
   return `Basic ${token}`
 }

module.exports = {
  makeUsersArray,
  makeArticlesArray,
  makeExpectedArticle,
  makeExpectedArticleComments,
  makeMaliciousArticle,
  makeCommentsArray,

  makeArticlesFixtures,
  cleanTables,
  seedArticlesTables,
  seedMaliciousArticle,
  makeAuthHeader,
  seedUsers,
}
