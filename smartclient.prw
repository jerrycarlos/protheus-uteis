#INCLUDE 'Rwmake.ch'
#INCLUDE 'Protheus.ch'
#INCLUDE 'TbIconn.ch'
#INCLUDE 'Topconn.ch'



//-------------------------------------------------------------------
/*/{Protheus.doc} smartclient
Utilitario para abrir conexao do smartclient
@author  Jerry Junior
@since   05/08/2024
@version 1.0
@type function
/*/
//-------------------------------------------------------------------
User Function USMART()
    Local cPathSmart := "C:\Users\jerry\OneDrive\TRABALHO\Totvs\SMARTCLIENT_2310\"
    Private cArqIni := cPathSmart + "smartclient.ini"
    Private cSmartClient := cPathSmart + "smartclient.exe"
    Private aIni := {}, aComboFil := {}, aAmbiente := {""}
    Private cServer := ""
    Private cPort := ""
    Private cPrograma := "SIGAMDI      "
    aIni := GetINISessions(cArqIni)
    aEval(aIni, {|x| aAdd(aComboFil, x)}, 3)
    
    If Empty(FunName())
        PREPARE ENVIRONMENT EMPRESA '99' FILIAL '01'
    EndIf

    DEFINE MSDIALOG oDMonitor TITLE "Abre Sistema" FROM 178,181 TO 450,350 PIXEL   
    
    @ 001,001 SAY "Cliente " PIXEL OF oDMonitor        
	cConexao:= aComboFil[1]	
    oComboFil1 := TComboBox():New(007, 010,{|u|if(PCount()>0,cConexao:=u,cConexao)},aComboFil,65,30,oDMonitor,,{|| atualizaDados(oComboFil1:aItems[oComboFil1:nAt]) },,,,.T.,,,,,,,,,'cConexao')
    
    @ 022,001 SAY "Server " PIXEL OF oDMonitor      
    oGet1 := TGet():New( 027, 010, { | u | If( PCount() == 0, cServer, cServer := u ) },oDMonitor, 060, 010, "!@",, 0, 16777215,,.F.,,.T.,,.F.,,.F.,.F.,,.F.,.F. ,,"cServer",,,,.T.  )

    @ 042,001 SAY "Porta " PIXEL OF oDMonitor      
    oGet2 := TGet():New( 047, 010, { | u | If( PCount() == 0, cPort, cPort := u ) },oDMonitor, 060, 010, "!@",, 0, 16777215,,.F.,,.T.,,.F.,,.F.,.F.,,.F.,.F. ,,"cPort",,,,.T.  )

    @ 062,001 SAY "Ambiente " PIXEL OF oDMonitor      
    cAmbiente:= aAmbiente[1]	
    oComboFil2 := TComboBox():New(067, 010,{|u|if(PCount()>0,cAmbiente:=u,cAmbiente)},aAmbiente,65,30,oDMonitor,,{||  },,,,.T.,,,,,,,,,'cAmbiente')

    @ 082,001 SAY "Programa Inicial " PIXEL OF oDMonitor      
    oGet3 := TGet():New( 087, 010, { | u | If( PCount() == 0, cPrograma, cPrograma := u ) },oDMonitor, 060, 010, "!@",, 0, 16777215,,.F.,,.T.,,.F.,,.F.,.F.,,.F.,.F. ,,"cPrograma",,,,.T.  )

    TButton():New( 107, 010, "Abrir",oDMonitor,{|| abreSmart(cSmartClient, cConexao, cAmbiente, cPrograma) }, 40,12,,,.F.,.T.,.F.,,.F.,,,.F. )	 

    atualizaDados(oComboFil1:aItems[oComboFil1:nAt])
    
	ACTIVATE MSDIALOG oDMonitor CENTERED
    
Return

Static Function atualizaDados(cCliente)
    Local aAmbiente := {}

    cServer :=  GetPvProfString(cCliente, "server", "", cArqIni)
    cPort := GetPvProfString(cCliente, "port", "", cArqIni)
    aAmbiente := Separa(GetPvProfString(cCliente, "ambiente", "", cArqIni), ",")
    oComboFil2:aItems := aAmbiente
    oGet1:CtrlRefresh()
    oGet2:CtrlRefresh()
Return

Static Function abreSmart(cSmartClient, cConexao, cAmbiente, cPrograma)

    ShellExecute( "Open", cSmartClient, " -m -c=" + Alltrim(cConexao) + " -e=" + Alltrim(cAmbiente) + " -p=" + Alltrim(cPrograma), "C:\", 1)

Return


User Function USMART2()
    Local oDlg, oLayer	:= FWLayer():New()
    Private cArqIni := GetRemoteIniName()
    Private cSmartClient := "C:\Users\jerry\OneDrive\TRABALHO\Totvs\SMARTCLIENT_2310\smartclient.exe"
    Private aIni := {}, aComboFil := {}, aAmbiente := {""}
    Private cServer := ""
    Private cPort := ""
    Private cPrograma := "SIGAMDI      "
    
    nX := msAdvSize(.F.)[5]
	nY := msAdvSize(.F.)[6]

	If nX == 0
		nX := 1020
	EndIf

	If nY == 0
		nY := 600
	EndIf

    If Empty(FunName())
        PREPARE ENVIRONMENT EMPRESA '99' FILIAL '01'
    EndIf
    
    
    //ÚÄÄÄÄÄÄÄÄÄÄÄ¿
	//³Cria a tela³
	//ÀÄÄÄÄÄÄÄÄÄÄÄÙ
	oDlg := MSDialog():New(0,0,nY,nX,"Abrir sistema via arquivo INI",,,,,CLR_BLACK,CLR_WHITE,,,.T.)  	
	oDlg:lMaximized := .T.

	//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
	//³Cria o layer na tela³
	//ÀÄÄÄÄÄÄÄÄÄÄ2012ÄÄÄÄÄÄÄÄÄÄÙ
	oLayer:init(oDlg,.F.)
	//Painel 1
	//Linha 1
    oLayer:addLine("lin01",85,.F.)
	//Coluna 1 Grid 1
	oLayer:addCollumn("col01",80,.F.,"lin01")	
	oLayer:addWindow("col01","win01",'Servers',100,.T.,.T.,{|| }, "lin01",{|| })
	oPanel01 := oLayer:getWinPanel("col01","win01", "lin01")
	//Coluna 2 Grid 1
	oLayer:addCollumn("col02",20,.F.,"lin01")	
	oLayer:addWindow("col02","win02",'Ambientes',100,.T.,.T.,{|| }, "lin01",{|| })
	oPanel02 := oLayer:getWinPanel("col02","win02", "lin01")

    //Linha 2
	oLayer:addLine("lin02",15,.F.)
	oLayer:addCollumn("col01",100,.F.,"lin02")	
	oLayer:addWindow("col01","win01",'Info Server',100,.F.,.T.,{|| }, "lin02",{|| })
	oPanel03 := oLayer:getWinPanel("col01","win01", "lin02")
    

    aIni := GetINISessions(cArqIni)
    aServer := {}
    aEval(aIni, {|x| aAdd(aServer, x)}, 3)

    aHeadSrv := {;
        {'Conexão',15,''},;
        {'Ip',40,''},;
        {'Porta',2,''};
    }
    aColsSrv := {}
    For i:=1 to Len(aServer)
        cCliente := aServer[i]
        cServer  :=  GetPvProfString(cCliente, "server", "", cArqIni)
        cPort    := GetPvProfString(cCliente, "port", "", cArqIni)
        aAdd(aColsSrv, {;
            cCliente,;
            cServer,;
            cPort;
        })
    Next

    //Monta o Browse
	oBrwSrv 	:= uFwBrowse():create(oPanel01,,aColsSrv,,aHeadSrv,,,,.F.)
	oBrwSrv:disableConfig()
	oBrwSrv:disableReport()	

	oBrwSrv:bChange := {|| mostraAmbiente(oBrwSrv:oData:aArray[oBrwSrv:nAt][1]) }
	//aColDados 	:= oBrwEnv:oData:aArray

    aHeadEnv := {{'Ambiente',20,''}}
    aColsEnv := {}
    aAmbiente := Separa(GetPvProfString(oBrwSrv:oData:aArray[1][1], "ambiente", "", cArqIni), ",")
    aEval(aAmbiente, {|a| aAdd(aColsEnv, {a}) })
    //Monta o Browse
	oBrwEnv 	:= uFwBrowse():create(oPanel02,,aColsEnv,,aHeadEnv,,,, .F.)	
	oBrwEnv:disableConfig()
	oBrwEnv:disableReport()
	

	oBrwSrv:activate()  

	oBrwEnv:activate()	

    cPrograma := "SIGAMDI          "
    @ 001,001 SAY "Programa Inicial " PIXEL OF oPanel03      
    oGet3 := TGet():New( 006, 001, { | u | If( PCount() == 0, cPrograma, cPrograma := u ) },oPanel03, 060, 010, "!@",, 0, 16777215,,.F.,,.T.,,.F.,,.F.,.F.,,.F.,.F. ,,"cPrograma",,,,.T.  )

    TButton():New( 001, 070, "Abrir"  ,oPanel03,{|| abreSmart(cSmartClient, oBrwSrv:oData:aArray[oBrwSrv:nAt][1], oBrwEnv:oData:aArray[oBrwEnv:nAt][1], cPrograma)}, 50,15,,,.F.,.T.,.F.,,.F.,,,.F. )

	//Inicia contador, para atualização da tela automaticamente
	//oTimer := TTimer():New(nTempo, {|| atuDadosDia(dDataDe,dDataAte) }, oDlg )
    //oTimer:Activate()

	//ÚÄÄÄÄÄÄÄÄÄÄÄÄ¿
	//³Ativa a tela³
	//ÀÄÄÄÄÄÄÄÄÄÄÄÄÙ
	oDlg:Activate(,,,.T.,{||,.T.},,{||} )

Return


Static Function mostraAmbiente(cCliente)
    cServer :=  GetPvProfString(cCliente, "server", "", cArqIni)
    cPort := GetPvProfString(cCliente, "port", "", cArqIni)
    aAmbiente := Separa(GetPvProfString(cCliente, "ambiente", "", cArqIni), ",")

    oBrwEnv:oData:aArray := {}
    aEval(aAmbiente, {|a| aAdd(oBrwEnv:oData:aArray, {a})} )
    oBrwEnv:nAt := 1
    oBrwEnv:Refresh()
Return
