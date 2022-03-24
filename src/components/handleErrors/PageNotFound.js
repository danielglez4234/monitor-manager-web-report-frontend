/*
 * if the url does not match with '/Webreport' this html will be shown
 */
function PageNotFound() {
  return (
    <div className="page-not-found-cont">
      <div className="page-not-found-content">
      <svg className="page-not-found-svg" width="380px" height="500px" viewBox="0 0 837 1045" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <path d="M353,9 L626.664028,170 L626.664028,487 L353,642 L79.3359724,487 L79.3359724,170 L353,9 Z" id="Polygon-1" stroke="#007FB2" strokeWidth="6" ></path>
              <path d="M78.5,529 L147,569.186414 L147,648.311216 L78.5,687 L10,648.311216 L10,569.186414 L78.5,529 Z" id="Polygon-2" stroke="#EF4A5B" strokeWidth="6"></path>
              <path d="M639,529 L773,607.846761 L773,763.091627 L639,839 L505,763.091627 L505,607.846761 L639,529 Z" id="Polygon-4" stroke="#F2773F" strokeWidth="6"></path>
              <path d="M281,801 L383,861.025276 L383,979.21169 L281,1037 L179,979.21169 L179,861.025276 L281,801 Z" id="Polygon-5" stroke="#36B455" strokeWidth="6"></path>
          </g>
      </svg>

      <svg className="page-not-found-svg-180" width="380px" height="500px" viewBox="0 0 837 1045" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <path d="M78.5,529 L147,569.186414 L147,648.311216 L78.5,687 L10,648.311216 L10,569.186414 L78.5,529 Z" id="Polygon-2-up" stroke="#dd8080" strokeWidth="6"></path>
              <path d="M281,801 L383,861.025276 L383,979.21169 L281,1037 L179,979.21169 L179,861.025276 L281,801 Z" id="Polygon-5" stroke="#abecf7" strokeWidth="6"></path>
              <path d="M639,529 L773,607.846761 L773,763.091627 L639,839 L505,763.091627 L505,607.846761 L639,529 Z" id="Polygon-4" stroke="#cca8d9" strokeWidth="6"></path>
          </g>
      </svg>
      <div>
        <h1 className="page-not-found-404">4<span className="page-not-found-cero">0</span>4</h1>
      </div>
        <p className="page-not-found-message">Oops! Something went wrong.</p>
        <a className="page-not-found-goHome" href="/WebReport"><i className="icon-home"></i> Go Home.</a>
      </div>
    </div>
  );
}

export default PageNotFound;
