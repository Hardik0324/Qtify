describe("Qtify Automation", () => {
    beforeEach(() => {
      cy.visit("https://example.com/");
      // cy.visit("https://example.com/");
    });
    describe("Albums Section tests", () => {
      before(() => cy.stubApiCalls());
  
      it("should show cards for Top and New Albums and verify the 'Show All' functionality", () => {
        const checkAlbumVisibilityAndToggleShowAll = (alias, label) => {
          // Click "Show All" and expect it to change to "Collapse"
          cy.get("body")
            .contains(/show all/i)
            .click()
            .should("not.contain.text", /show all/i)
            .and("not.contain.text", /show all/i);
  
          // Check the visibility after expanding
          cy.checkVisibilityForCategory(alias, label).then(
            (visibleCountAfter) => {
              cy.log(
                `Number of Visible Cards for ${label} after expanding: ${visibleCountAfter}`
              );
            }
          );
        };
  
        checkAlbumVisibilityAndToggleShowAll("@getTopAlbums", "Top Albums");
        checkAlbumVisibilityAndToggleShowAll("@getNewAlbums", "New Albums");
      });
    });
  
    describe("Slider functionality tests", () => {
      let firstTwoAlbums = []; // Define variable at a higher scope
  
      before(() => {
        cy.stubApiCalls(); // Stubbing API calls before tests
      });
  
      it("should verify if the first two albums are not visible after clicking the slider's next button 4 times", () => {
        // Wait for the relevant API(s) to complete
        cy.wait("@getTopAlbums").then((interception) => {
          const items = interception.response.body;
          firstTwoAlbums = items.slice(0, 2); // Storing the first two albums
        });
  
        cy.wait(["@getNewAlbums", "@getSongs"]);
  
        // Identify and click the slider's next button
        cy.get("svg, img, button, .icon").each(($el) => {
          const viewportWidth = Cypress.config("viewportWidth");
  
          const domElement = $el[0];
          const boundingRect = domElement.getBoundingClientRect();
          const isOnRightSide = boundingRect.right > viewportWidth * 0.9;
          const isCircular =
            Math.abs(boundingRect.width - boundingRect.height) < 10;
          const isSmall = boundingRect.height < 100;
  
          if (isOnRightSide && isCircular && isSmall) {
            // Click on the identified element 4 times
            cy.wrap($el).click().click().click().click();
          }
        });
  
        // Check and log what is visible after the clicks
        firstTwoAlbums.forEach((album) => {
          cy.get("body")
            .contains(album.title)
            .should("exist")
            .then(($title) => {
              if ($title.length > 0) {
                let card = $title.parent();
                if (card.is(":visible")) {
                  cy.log(`${album.title} is visible.`);
                }
              }
            });
        });
  
        // Check if the first two albums are not visible in the UI
        firstTwoAlbums.forEach((album) => {
          cy.get("body").contains(album.title).should("not.exist");
        });
      });
    });
  });
  