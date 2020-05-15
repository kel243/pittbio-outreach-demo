#loads programs required to generate graphics
library(shiny)
library(xlsx)
library(tidyverse)

#Spedifies layout application that visualizes mass change across habitats
ui <- fluidPage(
  
  # Application title
  titlePanel("Frog Mass Change Data Visualization"),
  
  #teacher instructions before data upload
  sidebarLayout(
    sidebarPanel(
      h3("Upload Teacher Metadata here"),
      p("Note - Before uploading the teacher metadata file, make 
      sure that both starting and ending mass are filled in for all
      observations. Make sure that mass does NOT have units typed in - 
        for example, type 60 instead of 60g in the spreadsheet."),
      #specifies where data is uploaded. accepts a variety of excel files
      fileInput("upload", "Upload Teacher Metadata_final with mass.xlsx", 
                accept = c("xlsx", ".xlsx", "xls", ".xls"))
    ),
    
    #Show plots once excel spreadsheet has been uploaded
    mainPanel(
      plotOutput("startEndMass"),
      plotOutput("massChangeByHabitat")
    )
    
)
)