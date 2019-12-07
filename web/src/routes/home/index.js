import { h } from 'preact';
import style from './style';

const Home = () => (
	<div class={style.home}>
		<h1>Home</h1>
		<p>This is the incredible Home component.</p>
		<button onClick={fetchTest}> Test Backend </button>
	</div>
);

async function fetchTest() {
	const response = await fetch('http://localhost:5000/gimmejson');
	const myJson = await response.json();
	console.log(myJson);
}

export default Home;
