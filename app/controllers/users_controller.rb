class UsersController < ApplicationController
  before_action :authenticate_user!

  def fight
    @bot = current_user.dup
    @bot.handle_bot_hp(current_user)
    @equipment = current_user.items.equipment
    @useable = current_user.items.useable.map do |item|
      item.count = item.inventories.first.count
      item
    end
  end

  def add_experience
    current_user.increment(:experience, params[:experience])

    if current_user.save
      render json: { status: 'OK' }.to_json
    else
      render json: current_user.errors, status: :unprocessable_entity
    end
  end

  def remove_item
    item = Inventory.find_by(user_id: current_user.id,
                             item_id: params[:item_id])
    if item.count > 1
      item.update_attributes(count: item.count - 1)
    else
      item.destroy
    end
  end

  private

  def user_params
    params.require(:user).permit(:experience)
  end
end
