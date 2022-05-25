import React, {useEffect, useState} from "react";
import lottery from "./lottery";
import web3 from "./web3";

const App = () => {
  const [data, setData] = useState({manager: '', players: [], balance: ''});
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function initializeLottery() {
      const manager = await lottery.methods.manager().call();
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);
      setData({manager, players, balance});
    }
    initializeLottery();
  }, [])

  const onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.requestAccounts(); // this not getting accounts
    console.log('accounts', accounts);
    setMessage('Waiting on transaction success...')
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether')
    })
    setMessage('You have been entered')
  }

  const onClick = async () => {
    const accounts = await web3.eth.requestAccounts();
    setMessage('Waiting on transaction success...')
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    })
    setMessage('A winner has been picked!')
  }

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {data.manager}.
        There are currently {data.players.length} people entered,
        competing to win {web3.utils.fromWei(data.balance, 'ether')} ether!
      </p>
      <hr />
      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input onChange={e => setValue(e.target.value)} value={value}/>
        </div>
        <button>Enter</button>
      </form>
      <hr />
      <h4>Ready to pick a winner?</h4>
      <button onClick={onClick}>Pick a winner</button>
      <h1>{message}</h1>
    </div>
  )
}

export default App;
