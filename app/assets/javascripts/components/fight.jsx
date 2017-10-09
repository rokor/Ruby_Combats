class Fight extends React.Component {

  constructor() {
    super();

    this.state = {
      urlImg: "/assets/hit-static.gif",
      urlImgUser: "/assets/user-photo.gif",
      urlImgBot: "/assets/bot1.gif",
      userH: {
        attackU: '',
        blockU: ''
      },
      botH: {
        attackB: 0,
        blockB: 0
      },
      hitlog: "Let's Fight",
      btnClick: '',
      attack: {
        head: "Hit head",
        chest: "Hit ches",
        stomach: "Hit stomach",
        lowerback: "Hit lowerback",
        belt: "Hit belt",
        legs: "Hit legs"
      },
      block: {
        head: "Block head",
        chest: "Block ches",
        stomach: "Block stomach",
        lowerback: "Block lowerback",
        belt: "Block belt",
        legs: "Block legs"
      },
      demageU: 10,
      demageB: 13
    }
  }

  setAnimationLog(imgPath, log){
      this.setState({ urlImg: imgPath });
      this.setState({ hitlog: log });
  }

  handleChange(event) {
    event.preventDefault();

    let userH = this.state.userH;
    let name = event.target.name;
    let value = event.target.value;
    userH[name] = value;

    this.setState({userH});
  }

  botRandHit() {
    let countSelect = this.child.countOptions()
    let botH = this.state.botH;

    let attack = Math.floor(Math.random() * countSelect) + 0 ;
    let block =  Math.floor(Math.random() * countSelect) + 0 ;

    botH[0] = attack;
    botH[1] = block;

    this.setState({botH})
  }


  checkPlayersMiss(attack, block, player) {
    if ( attack != block) {
      if (player == 'Bot') {
        this.props.bot.hp -= this.state.demageU;
      }else
       this.props.user.hp -= this.state.demageU;
    }
  }


  runFight() {
    this.buttonEnabled(false);
    this.botRandHit()

    let attackU = this.state.userH["attackU"]
    let blockU = this.state.userH["blockU"];
    let attackB = this.state.botH[0];
    let blockB = this.state.botH[1];

    this.checkPlayersMiss(attackU, blockB, 'Bot')
    this.setAnimationLog("/assets/hit-1.gif", "User hit")

    let promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.buttonEnabled(true));
      }, 4000);
    });
    promise
    .then(
      result => {
        this.checkPlayersMiss(attackB , blockU, 'User')
        this.setAnimationLog("/assets/hit-2.gif", "Bot hit")
      }
    )
  }

  playerAlive(player) {
    if (player == 'User') {
      if (this.props.user.hp <= 0)
      {
        this.props.user.hp = 0;
      }
    return this.props.user.hp
      }
      else if (this.props.bot.hp <= 0)
      {
        this.props.bot.hp = 0;
      }
    return this.props.bot.hp
  }

  changeFightProperty() {
    const user = this.props.user;
    const bot = this.props.bot;
    let EXP = 0;
    let winner = 'BOT';

    if (bot.hp <=0 || user.hp <=0) {
      switch (true) {
        case user.hp < 0 && bot.hp < 0:
          EXP = 5;
          winner = 'DRAW!. Really? It happens sometimes..';
          break;
        case user.hp > bot.hp:
          EXP = 10;
          winner = 'YOU';
          break;
        default:
          EXP = 1;
          break;
      }

      this.sendExp(EXP).then(() => {
        this.buttonEnabled(false);

        alert (
         `The fight has ENDED! And the winner is: ${winner}!` +
         `\nPlease, refresh the page to start a new one.`
        );
      });

    } else {
      this.runFight();
    }
  }

  sendExp(EXP) {
    const url = `/users/${this.props.user.id}/addexp`;
    this.initAxiosHeaders();

    return new Promise(
      (resolve, reject) => {
        axios.post(url, {
          experience: EXP
        }).then(response => {
          resolve();
        });
      }
    )
  }

  initAxiosHeaders() {
    const token = document.querySelector("meta[name=csrf-token]").getAttribute('content');

    axios.defaults.headers.common['X-CSRF-Token'] = token;
    axios.defaults.headers.common['Accept'] = 'application/json';
  }

  buttonEnabled(enabled) {
    const status = enabled ? '' : 'true'
    this.setState({ btnClick: status });
  }

  render () {
    return (
      <div>
       <table className="table center">
        <thead>
          <FightTopHeader player={'Player'} playInfo={'PLAY INFO'} bot={'Bot'}/>
          <tr>
             <td>
              <p>HP: { this.playerAlive('User') } | Power: {this.state.demageU}</p>
              <meter value={this.props.user.hp} min="0" max="100">2 out of 10</meter><br /><br />
              <img src={ this.state.urlImgUser } /><br/>
              <SelectHitBlock
                handleChange={ this.handleChange.bind(this) }
                ref={instance => { this.child = instance; }}
              />
           </td>
            <td className='arena-fights'>
              <i>{ this.state.hitlog }</i>
              <img src={ this.state.urlImg } />
            </td>
             <td>
              <p>HP: { this.playerAlive('Bot') } | Power: {this.state.demageB}</p>
              <meter value={this.props.bot.hp} min="0" max="100"></meter><br /><br />
              <img src={ this.state.urlImgBot } /><br/>
              <b>{this.state.attack[Object.keys(this.state.attack)[this.state.botH[0]]] }</b>
              <br />
              <b>{this.state.block[Object.keys(this.state.block)[this.state.botH[1]]]} </b>
            </td>
          </tr>
          <tr>
              <ButtonStart
                btnClick={this.state.btnClick}
                changeFightProperty={ this.changeFightProperty.bind(this)}
              />
             <td>
              <h2>{this.props.user.name}</h2>
              <p>Experience: {this.props.user.experience}</p>
              <p>{this.props.user.email}</p>
            </td>
            <td></td>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      </div>
    )
  }
}
