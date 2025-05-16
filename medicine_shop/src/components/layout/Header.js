import CartButton from "./CartButton"
import MedicineForm from "./MedicineForm"

const Header = (props) => {
    return(
        <Header>
            <MedicineForm></MedicineForm>
            <CartButton></CartButton>
        </Header>
    );
}

export default Header