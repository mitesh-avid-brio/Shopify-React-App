
const FAQ = ({showFaq, setShowFaq}) => {
    <>
         <div className="faq-container">
            <h2>Frequently Asked Questions</h2>
            {/* FAQ content goes here */}
            <button onClick={() => setShowFaq(false)}>Close FAQ</button>
        </div>
    </>
}

export default FAQ;