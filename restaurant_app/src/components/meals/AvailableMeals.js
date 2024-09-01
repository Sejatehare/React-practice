import classes from "./AvailableMeals.module.css";

const DUMMYY_MEALS = [
    {
        id: 'm1',
        name: 'Veg Curry',
        description: 'Mixed Vegetables cooked in a curry sauce',
        price: '8.5',
    },
    {
        id: 'm2',
        name: 'Dosa',
        description: 'Two lentils and rice crepes stuffed with potato, served with coconut chutney and lentil dal',
        price: '4.35', 
    },
    {
        id: 'm3',
        name: 'Mango Lassi',
        description: 'Blend of yogurt, mango pulp, milk & sugar',
        price: '2.95',
    },
    {
        id: 'm4',
        name: 'Butter Chicken',
        description: 'Chicken cooked in a mild buttery curry sauce with fenugreek',
        price: '11.25',
    },
    {
        id: 'm5',
        name: 'Palak Paneer',
        description: 'Homemade cheese and spinach',
        price: '10.5',
    },
    {
        id: 'm6',
        name: 'Cheese Naan',
        description: 'Flatbread stuffed in a tandoor and stuffed with cheese',
        price: '3.5',
    },
    {
        id: 'm7',
        name: 'Samosa',
        description: 'Crispy fried dumplings stuffed with potatoes and vegies',
        price: '4.0'
    },
];

const AvailableMeals = () => {
    const mealsList = DUMMYY_MEALS.map(meal => <li>{meal.name}</li>);

    return <section className={classes.meals}>
        <ul>
            {mealsList}
        </ul>
    </section>
}

export default AvailableMeals;