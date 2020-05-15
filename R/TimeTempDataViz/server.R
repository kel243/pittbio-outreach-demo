#This program specifies what happens when an excel spreadsheet containing data is uploaded
function(input, output, session) {
  
  data<-reactive({
    req(input$upload)
    #read data from excel spreadsheet, starting from row 5 and skipping empty rows
    df<-read.xlsx(input$upload$datapath, sheetName="Sheet1", header=FALSE, startRow=5, skipEmptyRows=TRUE)
    #remove incomplete data 
    df<-df[,colSums(is.na(df))<nrow(df)]
    df<-na.omit(df)
    df<-subset(df, select= -skipEmptyRows)
    #name columns for spreadsheet so we can refer to them later
    colnames(df)<-c("Time.Sun.1", "Temp.Sun.1", "Time.Shade.1", "Temp.Shade.1", "Time.Sun.2", "Temp.Sun.2",
                    "Time.Shade.2", "Temp.Shade.2")
    return(df)
  })
  
  #create histogram of temperatures for frogs in the sun 
  output$histSun <- renderPlot({
    # extract temperature data for sun
    x<- data()[, "Temp.Sun.1"] 
    bins <- seq(min(x), max(x), length.out = input$bins + 1)
    #histogram: x-axis is temperature, y-axis is frequency
    hist(x, main="Frog Temperature Observations (Sun)",
         xlab="Temperature (Celsius)", ylab="Count", breaks=bins, col = 'goldenrod1', border = 'white')
  })
  
  #create historgrams of temperature for frogs in the shade
  output$histShade <- renderPlot({
    # extract temperature data for shade
    x<-data()[, "Temp.Shade.1"] 
    bins <- seq(min(x), max(x), length.out = input$bins + 1)
    #histogram: x-axis is temperature, y-axis is frequency
    hist(x, main="Frog Temperature Observations (Shade)",
         xlab="Temperature (Celsius)", breaks=bins, ylab="Count", col = 'darkblue', border = 'white')
  })
  
  #create scatterplot plotting hour-by-hour temperatures for frogs, color coded by microhabitat 
  output$scatterPlot <- renderPlot({
    #combine time and temperature data from both microhabitats
    x<-data()[, c("Time.Sun.1","Temp.Sun.1")]
    y<-data()[, c("Time.Shade.1","Temp.Shade.1")]
    temps<-cbind(x[,"Temp.Sun.1"],y[,"Temp.Shade.1"])
    #define scale for y-axis of graph
    min<-floor(min(temps)) - 1
    max<-ceiling(max(temps)) + 4
    #plot temperature and time data for frogs in the sun
    plot(x, main="Time vs Temperature", xlab="Time", ylab="Temperature (Celsius)", 
         ylim=c(min, max), col="goldenrod1", pch=8)
    #add temperature and time data for frogs in the shade to the same plot 
    par(new=TRUE)
    plot(y, main="Time vs Temperature", xlab="Time", ylab="Temperature (Celsius)", 
         ylim=c(min, max), col="darkblue", pch=16)
    #add a legend
    legend(x="topright", legend=c("Sun", "Shade"), col=c("goldenrod1","darkblue"), pch=c(8,16), border='white')
  })
}
