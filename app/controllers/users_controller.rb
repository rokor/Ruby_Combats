class UsersController < ApplicationController
  before_action :retrieve_users, :authenticate_user!
  before_action :authenticate_user!
  skip_before_action :verify_authenticity_token

  def index
    authorize @users
    @roles = Role.all
  end

  def update
    @user = User.find(params[:id])
    authorize @user
    @user.update(secure_params)
    respond_to do |format|
      format.html { redirect_to users_url }
      format.json { render json: @users }
    end
  end

  def destroy
    @user = User.find(params[:id])
    authorize @user
    @users.find(params[:id]).destroy
    respond_to do |format|
      format.html { redirect_to users_url }
      format.json { render json: @users }
    end
  end

  def profile
    @user = current_user
    @level = Level.includes(:users).find_by(users: { level_id: @user.level_id })
    @next_level = Level.find_by(id:  @user.level_id == 12 ? @user.level_id : @user.level_id.next )
    if current_user.save
      render 'profile'
    else
      render json: current_user.errors, status: :unprocessable_entity
    end
  end

  def fight
    @health_level = Level.includes(:users).find_by(users: { level_id: current_user.level_id })
    current_user.hp = @health_level.health_point_level
    @bot = current_user.dup
    @bot.handle_bot_hp(current_user)
    @equipment = current_user.items.equipment
    @useable = current_user.items.useable.map do |item|
      item.count = item.inventories.first.count
      item
    end
  end

  def online
    @users = User.where('last_request_at > ?', 5.minutes.ago)
  end

  def fight
    @bot = current_user.dup
    @bot.handle_bot_hp(current_user)
  end

  def add_experience
    current_user.increment(:experience, params[:experience])
    current_user.level_up

    if current_user.save
      render json: { status: 'OK' }.to_json
    else
      render json: current_user.errors, status: :unprocessable_entity
    end
  end

  def update_password
    @user = current_user
    @user.update(password_params)
    bypass_sign_in(@user)
    redirect_to users_profile_path
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

  def retrieve_users
    @users = policy_scope(User)
  end

  def secure_params
    params.require(:user).permit(:role_id)
  end

  def user_params
    params.require(:user).permit(:experience)
  end

  def password_params
    params.require(:user).permit(:password, :password_confirmation)
  end
end
