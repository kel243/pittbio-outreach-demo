#install programs necessary to create graphs
library(shiny)
library(xlsx)

#Define layour for application that provides visualizations of temperature changes over time
#for frogs in the sun and in the shade
ui <- fluidPage(
  
  # Application title
  titlePanel("Frog Temperature Data Visualization: Sun vs. Shade"),
  
  # Defines layout of sidebar with a slider input for number of bins in the histogram
  sidebarLayout(
    sidebarPanel(
      #upload excel file, accepts variety of excel filetypes 
      fileInput("upload", "Upload SunShadeFrogDataforHistogram.xlsx", 
                accept = c("xlsx", ".xlsx", "xls", ".xls")),
      #add slider input, set minimum, maximum, and default number of bins
      sliderInput("bins",
                  "Number of bins for histogram:",
                  min = 1,
                  max = 30,
                  value = 8)
    ),
    
    # Add data visualizations once excel file has been uploaded
    mainPanel(
      plotOutput("histSun"),
      plotOutput("histShade"),
      plotOutput("scatterPlot")
    )
    
  )
)
