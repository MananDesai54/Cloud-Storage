const timeline = gsap.timeline({
    defaults:{
        duration:0.5,
    }
});

timeline
    // .from('.intro',{
    //     x:'-100%',
    //     borderRadius:'100%',
    //     opacity:0,
    //     // delay:4.2
    // })
    .from('.intro__data',{
        opacity:0,
        stagger:0.2
    },'+=4.5')
    .from('.forms',{
        opacity:0
    })
    .from('.what-can-you-do',{
        opacity:0
    })
    .from('.cards__info',{
        opacity:0
    })
    .from('.how-to-use',{
        opacity:0
    })
    .from('footer',{
        opacity:0
    })