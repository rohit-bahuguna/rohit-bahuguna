import { SiCss3, SiExpress, SiMongodb, SiReact, SiRedux, SiNodedotjs, SiTailwindcss } from 'react-icons/si'

export const projects = [

    {
        background: 'red',
        image: 'images/myStore.png',
        heading: 'YOUR STORE',
        tech: [
            {
                title: 'React JS',
                Icon: SiReact
            },

            {
                title: 'Tailwild CSS',
                Icon: SiTailwindcss
            }
        ],
        description: "Your Store is a An groceries portal for every people out there. This shop is the one-stop solution for any grocery need, be it Fruits, Vegetables,Dairy, Bakery or Beverages. Your Store has it all.",

        points: ['Product filter for easy access', 'User authentication', 'Cart Management', 'Wishlist Management'],
        githubUrl: 'https://github.com/rohit-bahuguna/your-store',
        liveUrl: 'https://yourstore-rohit.vercel.app/'
    },
    {
        background: 'red',
        image: 'images/yourstory.png',
        heading: 'YOUR STORY',
        tech: [
            {
                title: 'React',
                Icon: SiReact
            },
            {
                title: 'Redux',
                Icon: SiRedux
            },

            {
                title: 'Tailwild CSS',
                Icon: SiTailwindcss
            }
        ],
        description: "Your Story is a social media platform inspired from instagram to provide users the best of the  platform. 'Share moments' - 'Connect' - 'Know the world'",
        points: ['Post photo with caption', 'Follow/Unfollow users', 'Like and Comment post', 'Great user experience'],
        githubUrl: 'https://github.com/rohit-bahuguna/your-story',
        liveUrl: 'https://yourstory.vercel.app/'
    },
    {
        background: 'orange',
        image: 'images/api.png',
        heading: 'E-commerce API',
        tech: [
            {
                title: 'Node Js',
                Icon: SiNodedotjs
            },
            {
                title: 'Express',
                Icon: SiExpress
            },

            {
                title: 'Mongo DB',
                Icon: SiMongodb
            }
        ],
        description: "Your Story is a An  groceries portal for every people out there. This shop is the one-stop solution for any grocery need, be it Fruits, Vegetables,Dairy, Bakery or Beverages. Your Store has it all.",

        points: ['Product filter for easy access', 'User authentication', 'Cart Management', 'Wishlist Management'],
        githubUrl: 'https://github.com/rohit-bahuguna/your-store-backend',
        liveUrl: 'https://your-store-backend.rohitbahuguna2.repl.co'
    },

    {
        background: 'blue',
        image: 'images/weather.png',
        heading: 'Weather App',
        tech: [
            {
                title: 'React JS',
                Icon: SiReact
            },
            {
                title: 'CSS 3',
                Icon: SiCss3
            }


        ],
        description: "Your Story is a An  groceries portal for every people out there. This shop is the one-stop solution for any grocery need, be it Fruits, Vegetables,Dairy, Bakery or Beverages. Your Store has it all.",

        points: ['Product filter for easy access', 'User authentication', 'Cart Management', 'Wishlist Management'],
        githubUrl: 'https://github.com/rohit-bahuguna/weather-app-by-rohit',
        liveUrl: 'https://csb-nw0poz.netlify.app/'
    },

];

