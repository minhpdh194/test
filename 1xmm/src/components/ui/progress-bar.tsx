const ProgressBar = (props: any) => {
    const { completed } = props;

    const containerStyles = {
        height: 12,
        width: '100%',
        backgroundColor: "#CECECE",
        borderRadius: 50,
    }

    const fillerStyles = {
        height: 12,
        width: `${completed}%`,
        background: 'linear-gradient(180deg, #F79841 38.34%, #F9D838 100%)',
        borderRadius: '16px',
    }

    return (
        <div style={containerStyles}>
            <div style={fillerStyles}>
            </div>
        </div>
    );
};

export default ProgressBar;