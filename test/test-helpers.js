const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'test-user-1',
      email: 'TU1@test.com',
      password: 'password',
      date_created: new Date()
    },
    {
      id: 2,
      username: 'test-user-2',
      email: 'TU2@test.com',
      password: 'password',
      date_created: new Date()
    },
    {
      id: 3,
      username: 'test-user-3',
      email: 'TU3@test.com',
      password: 'password',
      date_created: new Date()
    },
    {
      id: 4,
      username: 'test-user-4',
      email: 'TU4@test.com',
      password: 'password',
      date_created: new Date()
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


function makeActivitiesArray(users, categories) {
  return [
    {
      id: 1,
      title: 'First test activity!',
      category_id: categories[0].id,
      user_id: users[0].id,
      duration: '5min',
      grouping: 'Groups',
      date_created: new Date(),
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
        id: 2,
        title: 'Second test activity!',
        category_id: categories[1].id,
        user_id: users[1].id,
        duration: '5min',
        grouping: 'Groups',
        date_created: new Date(),
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      },
      {
        id: 3,
        title: 'Third test activity!',
        category_id: categories[2].id,
        user_id: users[2].id,
        duration: '5min',
        grouping: 'Groups',
        date_created: new Date(),
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      },
      {
        id: 4,
        title: 'Fourth test activity!',
        category_id: categories[3].id,
        user_id: users[3].id,
        duration: '5min',
        grouping: 'Groups',
        date_created: new Date(),
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      },
  ]
}

function makeSavedLessonsArray(users, activities) {
  return [{
            id: 1,
            user_id: users[0].id,
            title: 'test 01',
            date: 'test 01',
            day: 'test 01',
            duration: 'test 01',
            classlevel: 'test 01',
            period: 'test 01',
            topic: 'test 01',
            goal: 'test 01',
            class_size: 1,
            objective_one: 'test 01',
            objective_two: 'test 01',
            objective_three: 'test 01',
            materials: 'test 01',
            warmup_id: activities[0].id,
            presentation_one_id: activities[0].id,
            presentation_two_id: activities[0].id,
            practice_one_id: activities[0].id,
            practice_two_id: activities[0].id,
            practice_three_id: activities[0].id,
            product_one_id: activities[0].id,
            product_two_id: activities[0].id,
            cooldown_id: activities[0].id,
            reflection_one: 'test 01',
            reflection_two: 'test 01',
            reflection_three: 'test 01',
            date_created: new Date(),
  },
  {
        id: 2,
        user_id: users[1].id,
            title: 'test 02',
            date: 'test 02',
            day: 'test 03',
            duration: 'test 02',
            classlevel: 'test 02',
            period: 'test 02',
            topic: 'test 02',
            goal: 'test 02',
            class_size: 2,
            objective_one: 'test 02',
            objective_two: 'test 02',
            objective_three: 'test 02',
            materials: 'test 02',
            warmup_id: activities[1].id,
            presentation_one_id: activities[1].id,
            presentation_two_id: activities[1].id,
            practice_one_id: activities[1].id,
            practice_two_id: activities[1].id,
            practice_three_id: activities[1].id,
            product_one_id: activities[1].id,
            product_two_id: activities[1].id,
            cooldown_id: activities[1].id,
            reflection_one: 'test 02',
            reflection_two: 'test 02',
            reflection_three: 'test 02',
        date_created: new Date(),
    },
    {
      id: 3,
      user_id: users[2].id,
            title: 'test 03',
            date: 'test 03',
            day: 'test 03',
            duration: 'test 03',
            classlevel: 'test 03',
            period: 'test 03',
            topic: 'test 03',
            goal: 'test 03',
            class_size: 3,
            objective_one: 'test 03',
            objective_two: 'test 03',
            objective_three: 'test 03',
            materials: 'test 03',
            warmup_id: activities[2].id,
            presentation_one_id: activities[2].id,
            presentation_two_id: activities[2].id,
            practice_one_id: activities[2].id,
            practice_two_id: activities[2].id,
            practice_three_id: activities[2].id,
            product_one_id: activities[2].id,
            product_two_id: activities[2].id,
            cooldown_id: activities[2].id,
            reflection_one: 'test 03',
            reflection_two: 'test 03',
            reflection_three: 'test 03',
      date_created: new Date(),
    },
    {
            id: 4,
            user_id: users[3].id,
            title: 'test 04',
            date: 'test 04',
            day: 'test 04',
            duration: 'test 04',
            classlevel: 'test 04',
            period: 'test 04',
            topic: 'test 04',
            goal: 'test 04',
            class_size: 4,
            objective_one: 'test 04',
            objective_two: 'test 04',
            objective_three: 'test 04',
            materials: 'test 04',
            warmup_id: activities[3].id,
            presentation_one_id: activities[3].id,
            presentation_two_id: activities[3].id,
            practice_one_id: activities[3].id,
            practice_two_id: activities[3].id,
            practice_three_id: activities[3].id,
            product_one_id: activities[3].id,
            product_two_id: activities[3].id,
            cooldown_id: activities[3].id,
            reflection_one: 'test 04',
            reflection_two: 'test 04',
            reflection_three: 'test 04',
      date_created: new Date(),
    }]
}

function makeMaliciousActivity(user) {
  const maliciousActivity = {
    id: 911,
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    category_id: categories[0].id,
    user_id: user.id,
    duration: '5min',
    grouping: 'Groups',
    date_created: new Date(),
    content: 'Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
  }

  const expectedActivity = {
    ...makeExpectedActivity([user], maliciousActivity),
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousActivity,
    expectedActivity,
  }
}

function makeExpectedCategory(category) {
return {
    id: category.id,
    title: category.title,
  }
}

function makeExpectedUser(user) {
  return {
      id: user.id,
      username: user.username,
    }
  }

  function makeExpectedSavedLesson(lesson) {
    return {
        id: lesson.id,
        user_id: lesson.user_id,
        title: lesson.title,
        date: lesson.date,
        day: lesson.day,
        duration: lesson.duration,
        classlevel: lesson.classlevel,
        period: lesson.period,
        topic: lesson.topic,
        goal: lesson.goal,
        class_size: lesson.class_size,
        objective_one: lesson.objective_one,
        objective_two: lesson.objective_two,
        objective_three: lesson.objective_three,
        materials: lesson.materials,
        warmup_id: lesson.warmup_id,
        presentation_one_id: lesson.presentation_one_id,
        presentation_two_id: lesson.presentation_two_id,
        practice_one_id: lesson.practice_one_id,
        practice_two_id: lesson.practice_two_id,
        practice_three_id: lesson.practice_three_id,
        product_one_id: lesson.product_one_id,
        product_two_id: lesson.product_two_id,
        cooldown_id: lesson.cooldown_id,
        reflection_one: lesson.reflection_one,
        reflection_two: lesson.reflection_two,
        reflection_three: lesson.reflection_three,
        date_created: lesson.date_created,
      }
    }

    function makeExpectedActivity(activity){
      return{
      id: activity.id,
      title: activity.title,
      content: activity.content,
      duration: activity.duration,
      grouping: activity.grouping,
      category_id: activity.category_id,
      user_id: activity.user_id,
      date_created: activity.date_created,
    }
    }
  

function makeActivitiesFixtures() {
  const testUsers = makeUsersArray()
  const testCategories = makeCategoriesArray()
  const testActivities = makeActivitiesArray(testCategories, testUsers )
  return { testUsers, testActivities, testCategories}
}

function makeCategoriesFixtures() {
  const testCategories = makeCategoriesArray()
  return { testCategories }
}

function makeUsersFixtures() {
  const testUsers = makeUsersArray()
  return { testUsers }
}

function makeSavedLessonsFixtures(){
  const testUsers = makeUsersArray()
  const testCategories = makeCategoriesArray()
  const testActivities = makeActivitiesArray(testCategories, testUsers )
  const testSavedLessons = makeSavedLessonsArray(testActivities, testUsers)
  return { testSavedLessons, testUsers, testActivities, testCategories }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        net_users,
        net_categories,
        net_activities,
        net_savedlessons
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE net_users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE net_categories_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE net_activities_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE net_savedlessons_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('net_users_id_seq', 0)`),
        trx.raw(`SELECT setval('net_categories_id_seq', 0)`),
        trx.raw(`SELECT setval('net_activities_id_seq', 0)`),
        trx.raw(`SELECT setval('net_savedlessons_id_seq', 0)`),
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
           `SELECT setval('net_users_id_seq', ?)`,
           [users[users.length - 1].id],
         )
       )
   }

function seedCategoriesTables(db, categories) {
    return db.into('net_categories').insert(categories)
      .then(() =>
        // update the auto sequence to stay in sync
        db.raw(
          `SELECT setval('net_categories_id_seq', ?)`,
          [categories[categories.length - 1].id],
        )
      )
  }

  function seedActivities(db, activities) {
    return db.into('net_activities').insert(activities)
      .then(() =>
        // update the auto sequence to stay in sync
        db.raw(
          `SELECT setval('net_activities_id_seq', ?)`,
          [activities[activities.length - 1].id],
        )
      )
  }

function seedActivitiesTables(db, users, categories, activities) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await seedCategoriesTables(trx, categories)
    await trx.into('net_activities').insert(activities)
    // update the auto sequence to match the forced id values
    await trx.raw(
        `SELECT setval('net_activities_id_seq', ?)`,
        [activities[activities.length - 1].id],
           )
    })
  }


  function seedSavedLessonsTables(db, users, categories, activities, savedlessons) {
    // use a transaction to group the queries and auto rollback on any failure
    return db.transaction(async trx => {
      await seedUsers(trx, users)
      await seedCategoriesTables(trx, categories)
      await seedActivities(trx, activities)
      await trx.into('net_savedlessons').insert(savedlessons)
      // update the auto sequence to match the forced id values
      await trx.raw(
          `SELECT setval('net_savedlessons_id_seq', ?)`,
          [savedlessons[savedlessons.length - 1].id],
             )
      })
    }



function seedMaliciousActivity(db, user, activity) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('net_activities')
        .insert([activity])
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}


module.exports = {
  makeUsersArray,
  makeUsersFixtures,
  makeActivitiesArray,
  makeMaliciousActivity,
  makeCategoriesArray,
  makeCategoriesFixtures,
  makeSavedLessonsArray,
  makeActivitiesFixtures,
  makeSavedLessonsFixtures,
  makeExpectedCategory,
  makeExpectedUser,
  makeExpectedSavedLesson,
  makeExpectedActivity,

  cleanTables,
  seedCategoriesTables,
  seedActivitiesTables,
  seedMaliciousActivity,
  seedSavedLessonsTables,
  makeAuthHeader,
  seedUsers,
}
