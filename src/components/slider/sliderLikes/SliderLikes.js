import React, { useState, useEffect, useRef } from 'react'
import './sliderLikes.scss';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import RemoveIcon from '@material-ui/icons/Remove';


function SliderLikes({ currentSlide, heartIcon }) {
    const [likes, setLikes] = useState(0);

    const [isAnimating, setIsAnimating] = useState(false);
    // Don't start a new animation until the previous one ends

    const refCountLikes = useRef();
    useEffect(() => {
        let sliderLikes = localStorage.getItem('sliderLikes');
        if (!sliderLikes) return;
        sliderLikes = JSON.parse(sliderLikes);
        setLikes(sliderLikes[currentSlide]);
        // After changing a slide, set the number of likes
    }, [currentSlide]);

    useEffect(() => {
        // if we change the number of likes => we save the changes to local storage
        let sliderLikes = localStorage.getItem('sliderLikes');
        if (!sliderLikes) return;
        sliderLikes = JSON.parse(sliderLikes);
        sliderLikes[currentSlide] = likes;
        localStorage.setItem('sliderLikes', JSON.stringify(sliderLikes));;
    }, [likes]);


    const changeNumberLikeAnimation = () => {
        //span with number likes scale animation
        refCountLikes.current.style.transform = 'scale(1.2)';
        setTimeout(() => {
            refCountLikes.current.style.transform = 'scale(1)';
        }, 200)
    }

    const setAsyncTimeout = (cb, timeout = 0) => new Promise(resolve => {
        setTimeout(() => {
            cb();
            resolve();
        }, timeout);
    });

    const addLike = async () => {
        setLikes(likes + 1);
        changeNumberLikeAnimation();

        if (isAnimating) return;
        setIsAnimating(true);
        heartIcon.current.firstChild.firstChild.style.animation = "anime-heart-out 0s linear forwards";
        heartIcon.current.style.transform = 'scale(1)';
        console.log('1');
        await setAsyncTimeout(() => {
            // 0.2s =>this is how long the animation takes  so we can start half time
            heartIcon.current.firstChild.firstChild.style.animation = "anime-heart 0.5s linear forwards";
        }, 100);
        await setAsyncTimeout(() => {
            // Let the filled heart be visible for a while
            heartIcon.current.style.transform = 'scale(0)';
        }, 1000);
        setIsAnimating(false);
    }
    const removeLike = async () => {
        if (likes === 0) return;
        setLikes(likes - 1);
        changeNumberLikeAnimation();

        if (isAnimating) return;
        setIsAnimating(true);
        heartIcon.current.firstChild.firstChild.style.animation = "anime-heart-in 0s linear forwards";
        heartIcon.current.style.transform = 'scale(1)';
        await setAsyncTimeout(() => {
            // 0.2s =>this is how long the animation takes so we can start half time
            heartIcon.current.firstChild.firstChild.style.animation = "anime-heart-out 0.5s linear forwards";
        }, 100);
        await setAsyncTimeout(() => {
            heartIcon.current.style.transform = 'scale(0)';
        }, 1000);
        setIsAnimating(false);
    }



    return (
        <div className='sliderLikes'>

            <Fab onClick={removeLike} color="secondary" >
                <RemoveIcon />
            </Fab>

            <div className='sliderLikes__count'>
                Polubień:
                <span ref={refCountLikes} className='sliderLikes__count--number'>
                    {likes}
                </span>

            </div>

            <Fab onClick={addLike} color="secondary" >
                <AddIcon />
            </Fab>


        </div>
    )
}

export default SliderLikes
