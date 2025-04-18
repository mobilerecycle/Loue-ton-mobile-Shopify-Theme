// Product Grid Column
theme.collectionProduct = (function () {
  function productGrid(e) {
   
    // Proudct Column
    const productColBtnWrapper = document.querySelector(
      ".product__grid_column_buttons"
    );
    if(productColBtnWrapper){
        const gridColumnButtons = productColBtnWrapper.querySelectorAll(".gird__column_icon");
        const girColumnWrapper = document.querySelector("#ProductGridContainer");
        const girColumnWrapperClssList = girColumnWrapper.classList;

        let gridClassName = localStorage.getItem("gridColumn");
        if (gridClassName) {
          girColumnWrapper.classList.remove(
            "grid-col-2",
            "grid-col-3",
            "grid-col-4"
          );
          girColumnWrapper.classList.add(gridClassName);
        }

        gridColumnButtons.forEach((singleItem) => {
          if (gridClassName) {
            switch (gridClassName) {
              case "grid-col-2":
                if (singleItem.classList.contains("product_col_two")) {
                  singleItem.classList.add("active");
                  getSiblings(singleItem).forEach(function (item) {
                    item.classList.remove("active");
                  });
                }
                break;
              case "grid-col-3":
                if (singleItem.classList.contains("product_col_three")) {
                  singleItem.classList.add("active");
                  getSiblings(singleItem).forEach(function (item) {
                    item.classList.remove("active");
                  });
                }
                break;
              default:
                if (singleItem.classList.contains("product_col_four")) {
                  singleItem.classList.add("active");
                  getSiblings(singleItem).forEach(function (item) {
                    item.classList.remove("active");
                  });
                }
            }
          }

          singleItem.addEventListener("click", (event) => {
            singleItem.classList.add("active");
            getSiblings(singleItem).forEach(function (item) {
              item.classList.remove("active");
            });

            if (singleItem.classList.contains("product_col_two")) {
              localStorage.setItem("gridColumn", "grid-col-2");

              gridClassName = localStorage.getItem("gridColumn");
              girColumnWrapper.classList.add(gridClassName);

              if (
                girColumnWrapperClssList.contains("grid-col-5") ||
                girColumnWrapperClssList.contains("grid-col-4") ||
                girColumnWrapperClssList.contains("grid-col-3") ||
                girColumnWrapperClssList.contains("grid-col-1")
              ) {
                girColumnWrapper.classList.remove(
                  "grid-col-5",
                  "grid-col-4",
                  "grid-col-3",
                  "grid-col-1"
                );
              }
            } else if (singleItem.classList.contains("product_col_three")) {
              localStorage.setItem("gridColumn", "grid-col-3");
              gridClassName = localStorage.getItem("gridColumn");

              girColumnWrapper.classList.add(gridClassName);
              if (
                girColumnWrapperClssList.contains("grid-col-5") ||
                girColumnWrapperClssList.contains("grid-col-4") ||
                girColumnWrapperClssList.contains("grid-col-2") ||
                girColumnWrapperClssList.contains("grid-col-1")
              ) {
                girColumnWrapper.classList.remove(
                  "grid-col-5",
                  "grid-col-4",
                  "grid-col-2",
                  "grid-col-1"
                );
              }
            } else if (singleItem.classList.contains("product_col_four")) {
              localStorage.setItem("gridColumn", "grid-col-4");
              gridClassName = localStorage.getItem("gridColumn");
              girColumnWrapper.classList.add(gridClassName);
              if (
                girColumnWrapperClssList.contains("grid-col-5") ||
                girColumnWrapperClssList.contains("grid-col-3") ||
                girColumnWrapperClssList.contains("grid-col-2") ||
                girColumnWrapperClssList.contains("grid-col-1")
              ) {
                girColumnWrapper.classList.remove(
                  "grid-col-5",
                  "grid-col-3",
                  "grid-col-2",
                  "grid-col-1"
                );
              }
            }
          });
        });
    }

  }
  return productGrid;
})();
