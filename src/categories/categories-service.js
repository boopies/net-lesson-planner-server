const CategoriesService = {
    getAllCategories(knex){
        return knex.select('*').from('net_categories')
        },
//for future use
        /*
    insertCategories(knex, newCategory) {
            return knex
                .insert(newCategory)
                .into('net_categories')
                .returning('*')
                .then(rows => rows[0])
        },
*/
    getById(knex, id) {
        return knex.from('net_categories')
        .select('*')
        .where('id', id)
        .first()
        },
//for future use
/*
    deleteCategory(knex, id) {
        return knex('net_categories')
            .where({ id })
            .delete()
        },
    updateCategory(knex, id, newCategoryFields) {
         return knex('net_categories')
            .where({ id })
            .update(newCategoryFields)
        }
*/
}

module.exports = CategoriesService