USE [dev]
GO

/****** Object:  Table [dbo].[Dirlyzer]    Script Date: 10.10.2012 19:15:58 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Dirlyzer](
	[Dirlyzer_ID] [bigint] IDENTITY(1,1) NOT NULL,
	[Run_ID] [bigint] NOT NULL,
	[Dirlyzer_Path] [nvarchar](max) NOT NULL,
	[Dirlyzer_Size] [float] NULL,
	[Dirlyzer_SizeUnit] [nchar](10) NULL,
	[Dirlyzer_Date] [datetime] NULL,
	[Dirlyzer_Filter] [nvarchar](255) NULL,
 CONSTRAINT [PK_Dirlyzer_1] PRIMARY KEY CLUSTERED 
(
	[Dirlyzer_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

