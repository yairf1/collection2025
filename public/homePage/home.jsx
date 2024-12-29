import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

function Card({ img, productName, price }) {
    return (
        <div className="card mb-3 justify-content-center mx-auto" id= {productName}>
            <div className="card-body justify-content-center mx-auto">
                <div className="row justify-content-end align-items-center mb-2">
                    <div className="col-sm-4 text-end" id="img">
                        <img src={img} alt="logo" width="90" height="65" />
                    </div>
                </div>
                <div className="row justify-content-end align-items-center mb-2">
                    <div className="col-sm-4 text-end" id="productName">
                        {productName}
                    </div>
                </div>
                <div className="row justify-content-end align-items-center mb-2">
                    <div className="col-sm-4 text-end" id="price">
                        {price}
                    </div>
                </div>
                <div className="row justify-content-end align-items-center mb-2">
                    <button className=" col-sm-4 text-end" id="addToCart">
                        הוסף לעגלה
                    </button>
                </div>
            </div>
        </div>
    );
}

function App() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('/home/getAllProducts');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products', error);
            }
        }

        fetchProducts();
    }, []);

    return (
        <div className="row">
            {products.map((product, index) => {
                <Card 
                    key={index}
                    img={product.img}
                    productName={product.productName}
                    price={product.price}
                />
            })}
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
