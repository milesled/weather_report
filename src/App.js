import React from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import ProgressBar from 'react-bootstrap/ProgressBar';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';


class App extends React.Component {

  state = {
    weather: null,
    loading: false,
    text: '',
    progress: 0,
    error: null
  }

  getWeather = async (e) => {
    // this line prevents the page from reloading (which is the default for <form> elements)
    e.preventDefault()
    // set "loading" to true in the state so we can show a spinner
    this.setState({ loading: true, weather: null, progress: 20 })
    // here is our giphy api key
    var key = 'fe5d2682f4cfbec37fdb7307df5d73d4'
    // this line make a URL string, I got this from their documentation
    var url = `http://api.openweathermap.org/data/2.5/forecast?q=${this.state.text}&units=imperial&APPID=${key}`
    // "fetch" calls the giphy API!
    var r = await fetch(url)
    await this.setState({ progress: 70 })
    // this lines extracts JSON (javascript object notation)
    var json = await r.json()
    await this.setState({ progress: 100 })
    // set the weather in state, and loading to false, and the progress bar to 0
    this.setState({ weather: json.list, loading: false, progress: 0 })

    // if you can find the city and info, continue on
    if (r.status === 200) {
      // set the weather in state, and loading to false, and the text to blank again
      this.setState({
        weather: json.list,
        loading: false,
        text: '',
        error: null
      })
      // otherwise, throw the error message
    } else {
      this.setState({
        error: json.message,
        loading: false
      })
    }
  }
  render() {
    // extract the pieces of state so we can use them easily in our HTML code
    var { weather, loading, text, progress, error } = this.state
    var data
    if (weather) {
      data = {
        labels: weather.map(w => moment(w.dt * 1000).format('MMMM Do YYYY, h:mm a')),
        datasets: [{
          borderWidth: 1,
          data: weather.map(w => w.main.temp),
          backgroundColor: 'rgba(132,99,255,0.2)' 
        }] 
      }
    }

    return (
      <div className="App">
        <Form className="App-header" onSubmit={this.getWeather}>
          <p style={{ margin: 10 }}>Search for temperatures of places around the world!</p>
          <Form.Control
            value={text}
            disabled={loading}
            placeholder="Enter City Name Here"
            onChange={e => this.setState({ text: e.target.value })}
            style={{ height: 60, width: '100%' }}
          />
          <Button
            disabled={loading}
            variant="primary"
            type="submit"
            size="lg"
            style={{ width: 150, margin: '0 10px', height: 60 }}>
            {loading ? 'Loading…' : 'Search'}
          </Button>
        </Form>
        {loading && <ProgressBar now={progress} animated="true" />}
        <main>
          {data && <Bar
            legend={false}
            data={data}
            options={{ maintainAspectRatio: true }}
          />}
        </main>
        {error && <div style={{ color: 'rgb(150,80,50)' }}>{error}</div>}
      </div>
    );
  }
}

export default App;
