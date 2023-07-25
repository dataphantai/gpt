const Page = ({
    children,
    flexDirection = "row",
    pageName = "generic",
    className = "",
}) => {
    return (
        <div
            className={`flex flex-${flexDirection} justify-center items-center h-screen ${className}`}
            data-page={pageName}
        >
            {children}
        </div>
    );
};

export default Page;
