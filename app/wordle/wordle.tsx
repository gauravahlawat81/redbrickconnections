import {observer, useLocalObservable} from 'mobx-react-lite';
import WordleStore from './store/WordleStore';
import Guess from './_components/Guess';
import Qwerty from './_components/Qwerty';


export default observer( function Home(){
    const store = useLocalObservable(()=> WordleStore)
    return (
        <div className=' w-screen h-scree flex flex-col items-center justify-center bg-gray-600'>
            <h1 className='text-6xl uppercase font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-green-400'>Wordle</h1>
            { new Array(6).fill(0).map((_,i) => (
            <Guess word={"tests"} guess={"guets"} isGuessed={true}/>
            ))}
            <h1>Won/Loss</h1>
            <Qwerty/>
        </div>
    )
})