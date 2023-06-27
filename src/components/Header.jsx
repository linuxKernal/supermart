
function Header() {
    return (
        <div className="relative  min-h-[40vh]">
            <img className="w-full h-96 object-cover" src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=5000&q=4000" alt="" />
            <div className="absolute top-20 w-4/5 md:w-2/4 right-3">
                <div className="backdrop-opacity-10 backdrop-invert bg-white/60 p-3 rounded-lg">
                    <h2 className="text-5xl text-green-500 mb-2 font-semibold">
                        WallMart
                    </h2>
                    <p className="md:text-lg text-zinc-800 drop-shadow-2xl sm:text-md">
                        Discover something new every day We've got what you need
                        Where shopping is a pleasure Experience the joy of
                        shopping with us and discover something new every day!
                        We offer an amazing selection of products that will
                        surely bring a smile Experience the difference with us Discover a world of possibilities
                    </p>
                </div>
            </div>
            <div className="2xl:absolute p-5   flex gap-10 justify-center flex-wrap w-[98.40%] top-full md:top-3/4">
                <div className="text-black bg-white p-5 w-96 shadow-xl border-b-2  border-green-600">
                    <h2 className="text-3xl mb-2">Walmart International</h2>
                    <p>
                        Walmart helps people save money and live better. Walmart
                        International delivers on this promise by bringing value
                        and convenience to millions of customers in 19 countries
                        outside the U.S. Our unique global perspective makes it
                        possible we're building strategic partnerships
                    </p>
                </div>
                <div className="text-black bg-white p-5 w-96 shadow-xl border-b-2  border-green-600">
                    <h2 className="text-3xl mb-2">Customers Connected</h2>
                    <p>
                        Direct marketing is a type of marketing that involves
                        communicating directly with customers and potential
                        customers in order to promote products and services. has
                        opened thousands of stores in the U.S. and expanded
                        internationally We've continued to ways to bring
                        technology
                    </p>
                </div>
                <div className="text-black bg-white p-5 w-96 shadow-xl border-b-2 border-green-600">
                    <h2 className="text-3xl mb-2"> Grow your business</h2>
                    <p>
                        Whether you want to sell products down the street or
                        around the world, we have all the tools you need Walmart
                        has opened thousands of stores in the U.S. and expanded
                        internationally International delivers on this promise
                        customers and communities around the globe
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Header;
