class UsersEditTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {users: this.props.users }
    this.updateList = this.updateList.bind(this);
  }

  updateList(users) {
    this.setState({users: users});
  }

  generate_tags(Tag, fields) {
    const ths = fields.map((name, index) => {
      return <Tag key={index}>{name}</Tag>;
    });

    return ths;
  }

  user_values(user) {
    const values = [user.id, user.name, user.email];

    let rows = this.generate_tags('td', values);

    return [
      rows,
      <td key={user.id}>
        <SelectItems items={this.props.roles} user={user} current_user={this.props.current_user} updateFunc={this.updateList}/>
      </td>,
      <td key={values.count + 1}>
        <DeleteUserButton user_id={user.id} updateFunc={this.updateList} />
      </td>
    ];
  }

  user_rows() {
    const current_user = this.props.current_user;
    const users = this.state.users;
    const roles = this.props.roles;

    const user_rows = users.map((user) => {
      return (
        <tr key={user.id}>
          {this.user_values(user)}
        </tr>
      )
    });
    return user_rows;
  }

  render () {
    return (
      <table className="table table-responsive table-hover">
        <thead>
          <tr>
            {this.generate_tags('th', constants.USERS_LIST_HEADERS)}
          </tr>
        </thead>
        <tbody>
          {this.user_rows()}
        </tbody>
      </table>
    );
  }
}
