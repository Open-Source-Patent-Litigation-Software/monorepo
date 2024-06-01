const SearchText = () => {
    return(
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "50%",
                textAlign: "center",
                justifyItems: "center",
                margin: "auto",
                fontSize: "1.5rem",
                fontWeight: "bold",
            }}
        >
            What makes a good search? A good search query is around 500
            words and details all the key inventive features of your idea.
            <br />
            <br />
            We break your search into many categories so we can properly
            analyze it. How does the search work? We use three specialized
            artificial intelligence models to break down your search query
            into categories and then analyze the patent landscape.
        </div>
    );
}

export default SearchText;