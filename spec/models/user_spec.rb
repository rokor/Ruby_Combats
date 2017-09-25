require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user_1) do
    User.create(
      name:     'Joe',
      email:    'joe@mail.com',
      password: 'joe_pass',
      password_confirmation: 'joe_pass'
    )
  end

  it 'is valid with a name, email, and password' do
    expect(user_1).to be_valid
  end

  it 'is invalid without a name' do
    user = User.new(name: nil)
    user.valid?
    expect(user.errors[:name]).to include("can't be blank")
  end

  it 'is invalid without an email address' do
    user = User.new(email: nil)
    user.valid?
    expect(user.errors[:email]).to include("can't be blank")
  end

  it 'is invalid with a duplicate email address' do
    user_1
    user = User.new(email: 'joe@mail.com')
    user.valid?
    expect(user.errors[:email]).to include('has already been taken')
  end

  it 'is invalid with a duplicate name' do
    user_1
    user = User.new(name: 'Joe')
    user.valid?
    expect(user.errors[:name]).to include('has already been taken')
  end

  it 'is invalid when email format is invalid' do
    addresses = %w[us@foo,com us_at.org ex.user@foo. fo@ba_ba.com foo@ba+ba.com]
    addresses.each do |invalid_address|
      user_1.email = invalid_address
      expect(user_1).not_to be_valid
    end
  end

  it 'is valid when email format is valid' do
    addresses = %w[user@foo.COM A_US-ER@f.b.org frst.lst@foo.jp a+b@baz.cn]
    addresses.each do |valid_address|
      user_1.email = valid_address
      expect(user_1).to be_valid
    end
  end

  describe 'when password is not present' do
    before { user_1.password = user_1.password_confirmation = ' ' }
    it 'is invalid' do
      expect(user_1).to be_invalid
    end
  end
end
