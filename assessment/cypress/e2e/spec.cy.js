describe("Qtify Automation", () => {
    beforeEach(() => {
      cy.visit("https://example.com/");
      // cy.visit("https://example.com/");
    });
    describe("Songs test", () => {
      it("should match the count of song cards with their respective API responses", () => {
        // Check songs
        cy.wait("@getSongs").then((interception) => {
          const songs = interception.response.body;
          let songElements = [];
  
          songs.forEach((song) => {
            cy.get("body")
              .contains(song.title)
              .should("exist")
              .then(($title) => {
                if ($title.length > 0) {
                  songElements.push($title);
                }
              });
          });
  
          // After checking all songs, assert the count
          cy.wrap(songElements).should("have.length", songs.length);
        });
      });
    });
  });
  