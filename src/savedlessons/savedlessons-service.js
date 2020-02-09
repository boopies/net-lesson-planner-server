const SavedlessonsService = {
    getAllSavedlessons(knex) {
      return knex.select('*').from('net_savedlessons')
    },
  
    insertSavedlesson(knex, newSavedlesson) {
      return knex
        .insert(newSavedlesson)
        .into('net_savedlessons')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('net_savedlessons')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deleteSavedlesson(knex, id) {
      return knex('net_savedlessons')
        .where({ id })
        .delete()
    },
  
    updateSavedlesson(knex, id, newSavedlessonFields) {
      return knex('net_savedlessons')
        .where({ id })
        .update(newSavedlessonFields)
    },
  }
  
  module.exports = SavedlessonsService