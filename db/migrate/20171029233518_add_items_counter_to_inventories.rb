class AddItemsCounterToInventories < ActiveRecord::Migration[5.1]
  def change
    add_column :inventories, :count, :integer, default: 1
  end
end
