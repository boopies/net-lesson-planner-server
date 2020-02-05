const ActivitiesService = {
    getAllActivities(knex) {
      return knex.select('*').from('net_activities')
    },
  
    insertActivity(knex, newActivity) {
      return knex
        .insert(newActivity)
        .into('net_activities')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('net_activities')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deleteActivity(knex, id) {
      return knex('net_activities')
        .where({ id })
        .delete()
    },
  
    updateActivity(knex, id, newActivityFields) {
      return knex('net_activities')
        .where({ id })
        .update(newActivityFields)
    },
  }
  
  module.exports = ActivitiesService