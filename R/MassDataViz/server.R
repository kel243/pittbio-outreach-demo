#This program specifies what happens when excel spreadsheet of mass data is uploaded
function(input, output, session) {
  
  #processes excel spreadsheet so that it is ready to be used to generate graphs
  data<-reactive({
    req(input$upload)
    #reads excel spreadsheet starting at row 5, skipping empty rows
    df<-read.xlsx(input$upload$datapath, sheetName="Sheet1", header=FALSE, startRow=5, skipEmptyRows=TRUE)
    #removes empty lines or incomplete data
    df<-df[,colSums(is.na(df))<nrow(df)]
    df<-na.omit(df)
    df<-subset(df, select= -skipEmptyRows)
    #labels column names by category
    colnames(df)<-c("Observation Number", "iButton Code", "Microhabitat", "Time Deployed", "Starting Mass", "End Mass")
    #sends data to graphing functions
    return(df)
  })
  
  #creates graph that plots net mass change for each observation color coded by microhabitat
  output$startEndMass <- renderPlot({
    num<-data()
    massChange<-num[,"Starting Mass"] - num[,"End Mass"] #calculates net mass change
    #creates scale for graphs
    min<-floor(min(massChange)) - 1
    max<-ceiling(max(massChange)) + 4
    num<-cbind(num, massChange)
    #standardizes microhabitat formatting 
    sun<-subset(num, Microhabitat=='sun' | Microhabitat=='Sun' | Microhabitat=='sun ' | Microhabitat=='Sun ')
    shade<-subset(num, Microhabitat=='shade' | Microhabitat=='Shade' | Microhabitat=='shade ' | Microhabitat=='Shade ')
    #plots all net mass changes for frogs in the sun 
    plot(x=sun$"Observation Number", y=sun$"massChange",  main="Net Mass Change", xlab="Observation Number", ylab="Net Mass Change (g)", 
         xlim=c(1, length(num$"Observation Number")), ylim=c(min,max), col="goldenrod1", pch=8)
    par(new=TRUE)
    #plots all net mass changes for frogs in the shade
    plot(x=shade$"Observation Number", y=shade$"massChange", main="Net Mass Change", xlab="Observation Number", ylab="Net Mass Change (g)", #xlim=c(min, max), 
         xlim=c(1, length(num$"Observation Number")), ylim=c(min, max), col="darkblue", pch=19)
    #creates legend for graph
    legend(x="topright", legend=c("Sun", "Shade"), col=c("goldenrod1","darkblue"), pch=c(8,19), border='white')
  })
  
  #creates graph depicting net mass change as arrows, color coded by habitat
  output$massChangeByHabitat <- renderPlot({
    x<-data()
    #standardizes microhabitat formatting 
    for (i in 1:length(x[,"Observation Number"]))
    {
      if(x[i,"Microhabitat"]=='sun' | x[i,"Microhabitat"]=='Sun' | x[i,"Microhabitat"]=='Sun ' | x[i,"Microhabitat"]=='sun ')
        x[i,"Microhabitat"]='sun'
      else
        x[i,"Microhabitat"]='shade'
    }
    #creates dataset containing only starting and ending masses
    m<-cbind(x[,"Starting Mass"], x[,"End Mass"])
    #defines y-axis scale for graph
    min<-floor(min(m)) - 1
    max<-ceiling(max(m)) + 10
    #creates color coding by microhabitat 
    levels<-as.factor(x[,"Microhabitat"])
    if(levels[1] == 'shade')
      levels<-fct_rev(levels)
    colors<-vector()
    for (i in 1:length(levels))
    {
      if(levels[i]=='sun')
        colors[i]='goldenrod1'
      else
        colors[i]='darkblue'
    }
    #plot starting masses as points on the graph (beginning of the arrow)
    plot(x=x$"Observation Number", y=x$"Starting Mass", main="Starting and Ending Mass", xlab="Observation Number", ylim=c(min, max), 
         ylab="Mass (g)", col=colors, pch=19)
    par(new=TRUE)
    #plot ending masses as triangles (end of the arrow)
    plot(x=x$"Observation Number", y=x$"End Mass", main="Starting and Ending Mass", xlab="Observation Number", ylim=c(min, max),
         ylab="Mass (g)", col=colors, pch=25, bg=colors)
    #connect points representing starting and ending masses, completing the arrows
    segments(1:length(x[,"Starting Mass"]), x[,"Starting Mass"], 1:length(x[,"End Mass"]), x[,"End Mass"], col=colors, lwd=3)
    #add legend to graph 
    legend(x="topright", legend=c("Sun", "Shade", "Start Mass Shape", "End Mass Shape"), col=c("goldenrod1","darkblue", "black", "black"), 
           pch=c(19,19,19,25), border='white')
  })
}